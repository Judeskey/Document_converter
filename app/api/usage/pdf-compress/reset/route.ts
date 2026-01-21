import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const TOOL_ID = "pdf-compress";
const VISITOR_COOKIE = "dc_vid";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 180; // 180 days

async function getOrSetDcVid() {
    const store = await cookies(); // ✅ await in Next 16.1+
    const existing = store.get(VISITOR_COOKIE)?.value;
    let dcVid = existing;

    if (!dcVid) {
        dcVid = crypto.randomUUID();
    }

    return { dcVid, store, isNew: !existing };
}

export async function POST() {
    // ✅ DEV-ONLY guard
    if (process.env.NODE_ENV === "production") {
        return NextResponse.json(
            { error: "Not available in production." },
            { status: 403 }
        );
    }

    const { dcVid, store, isNew } = await getOrSetDcVid();

    // ✅ Ensure visitor row exists (Visitor.dcVid is required + unique)
    const visitor = await prisma.visitor.upsert({
        where: { dcVid },
        update: {},
        create: { dcVid },
        select: { id: true },
    });

    // ✅ Reset usage for this tool + visitor (ToolUsage.visitorId references Visitor.id)
    await prisma.toolUsage.deleteMany({
        where: { visitorId: visitor.id, tool: TOOL_ID },
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
        res.cookies.set(VISITOR_COOKIE, dcVid, {
            path: "/",
            maxAge: COOKIE_MAX_AGE,
            sameSite: "lax",
            httpOnly: true,
            secure: false,
        });
    }

    return res;
}
