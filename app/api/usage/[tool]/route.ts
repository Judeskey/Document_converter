import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const VISITOR_COOKIE = "dc_vid";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 180; // 180 days

async function getVisitorId() {
    const store = await cookies(); // ✅ await in Next 16.1+
    let vid = store.get(VISITOR_COOKIE)?.value;

    if (!vid) {
        vid = crypto.randomUUID();
    }

    return { vid, store, isNew: !store.get(VISITOR_COOKIE) };
}

export async function GET(
    req: Request,
    ctx: { params: Promise<{ tool: string }> } // ✅ params is a Promise
) {
    const { tool } = await ctx.params; // ✅ await params
    const { vid, store, isNew } = await getVisitorId();

    // Ensure visitor row exists
    await prisma.visitor.upsert({
        where: { id: vid },
        update: {},
        create: { id: vid },
    });

    const used = await prisma.toolUsage.findUnique({
        where: { visitorId_tool: { visitorId: vid, tool } },
    });

    const res = NextResponse.json(
        {
            tool,
            freeUsed: !!used,
            freeRemaining: used ? 0 : 1,
        },
        { status: 200, headers: { "Cache-Control": "no-store" } }
    );

    // Set cookie if new
    if (isNew) {
        res.cookies.set(VISITOR_COOKIE, vid, {
            path: "/",
            maxAge: COOKIE_MAX_AGE,
            sameSite: "lax",
        });
    }

    return res;
}

export async function POST(
    req: Request,
    ctx: { params: Promise<{ tool: string }> }
) {
    const { tool } = await ctx.params;
    const { vid, isNew } = await getVisitorId();

    // Ensure visitor row exists
    await prisma.visitor.upsert({
        where: { id: vid },
        update: {},
        create: { id: vid },
    });

    // Mark free used (idempotent)
    await prisma.toolUsage.upsert({
        where: { visitorId_tool: { visitorId: vid, tool } },
        update: {},
        create: { visitorId: vid, tool },
    });

    const res = NextResponse.json(
        { ok: true, tool },
        { status: 200, headers: { "Cache-Control": "no-store" } }
    );

    if (isNew) {
        res.cookies.set(VISITOR_COOKIE, vid, {
            path: "/",
            maxAge: COOKIE_MAX_AGE,
            sameSite: "lax",
        });
    }

    return res;
}
