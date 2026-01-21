import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

const VISITOR_COOKIE = "dc_vid";

// Get or create a visitor ID (cookie)
function getVisitorId() {
    const store = cookies();
    let vid = store.get(VISITOR_COOKIE)?.value;

    if (!vid) {
        vid = crypto.randomUUID();
        store.set(VISITOR_COOKIE, vid, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 180, // 180 days
            path: "/",
        });
    }

    return vid;
}

/**
 * GET → check if free use remains for this tool
 */
export async function GET(
    _req: NextRequest,
    context: { params: Promise<{ tool: string }> }
) {
    const { tool } = await context.params;
    const vid = getVisitorId();

    // ensure visitor exists
    await prisma.visitor.upsert({
        where: { id: vid },
        update: {},
        create: { id: vid },
    });

    const used = await prisma.toolUsage.findUnique({
        where: {
            visitorId_tool: { visitorId: vid, tool },
        },
    });

    return NextResponse.json(
        { tool, freeUsed: !!used, freeRemaining: used ? 0 : 1 },
        { headers: { "Cache-Control": "no-store" } }
    );
}

/**
 * POST → consume free use (ONLY after successful conversion)
 */
export async function POST(
    _req: NextRequest,
    context: { params: Promise<{ tool: string }> }
) {
    const { tool } = await context.params;
    const vid = getVisitorId();

    const used = await prisma.toolUsage.findUnique({
        where: {
            visitorId_tool: { visitorId: vid, tool },
        },
    });

    if (used) {
        return NextResponse.json(
            { error: "Free use exhausted. Please subscribe." },
            { status: 402 }
        );
    }

    await prisma.toolUsage.create({
        data: { visitorId: vid, tool },
    });

    return NextResponse.json(
        { ok: true, consumed: true },
        { headers: { "Cache-Control": "no-store" } }
    );
}
