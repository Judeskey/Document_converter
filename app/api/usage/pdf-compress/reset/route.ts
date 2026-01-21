import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const TOOL_ID = "pdf-compress";
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

export async function POST() {
    // ✅ DEV-ONLY guard
    if (process.env.NODE_ENV === "production") {
        return NextResponse.json({ error: "Not available in production." }, { status: 403 });
    }

    const { vid, store, isNew } = await getVisitorId();

    // Ensure visitor row exists (same as your usage route)
    await prisma.visitor.upsert({
        where: { id: vid },
        update: {},
        create: { id: vid },
    });

    // Reset usage for this tool + visitor
    await prisma.toolUsage.deleteMany({
        where: { visitorId: vid, tool: TOOL_ID },
    });

    // Return the same “fresh” shape your GET computes (freeRemaining: 1 when not used)
    const res = NextResponse.json(
        {
            tool: TOOL_ID,
            freeUsed: false,
            freeRemaining: 1,
        },
        { status: 200, headers: { "Cache-Control": "no-store" } }
    );

    // Set cookie if new (same behavior as your usage route)
    if (isNew) {
        res.cookies.set(VISITOR_COOKIE, vid, {
            path: "/",
            maxAge: COOKIE_MAX_AGE,
            sameSite: "lax",
        });
    }

    return res;
}
