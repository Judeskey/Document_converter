import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

const VISITOR_COOKIE = "dc_vid";

// Get or create the cookie value (Visitor.dcVid)
async function getOrSetDcVid(): Promise<string> {
    const store = await cookies(); // typed as Promise<ReadonlyRequestCookies> in your build
    let dcVid = store.get(VISITOR_COOKIE)?.value;

    if (!dcVid) {
        dcVid = crypto.randomUUID();
        store.set(VISITOR_COOKIE, dcVid, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24 * 365, // 1 year
        });
    }

    return dcVid;
}

// Ensure Visitor row exists and return its DB id (Visitor.id)
async function ensureVisitor(): Promise<{ id: string; dcVid: string }> {
    const dcVid = await getOrSetDcVid();

    const visitor = await prisma.visitor.upsert({
        where: { dcVid },          // ✅ dcVid is @unique
        update: {},
        create: { dcVid },         // ✅ dcVid is required
        select: { id: true, dcVid: true },
    });

    return visitor;
}

/**
 * GET → check if free use remains for this tool
 */
export async function GET(
    _req: NextRequest,
    context: { params: Promise<{ tool: string }> }
) {
    const { tool } = await context.params;
    const visitor = await ensureVisitor();

    const used = await prisma.toolUsage.findUnique({
        where: {
            visitorId_tool: { visitorId: visitor.id, tool }, // ✅ FK uses Visitor.id
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
    const visitor = await ensureVisitor();

    const used = await prisma.toolUsage.findUnique({
        where: {
            visitorId_tool: { visitorId: visitor.id, tool },
        },
    });

    if (used) {
        return NextResponse.json(
            { error: "Free use exhausted. Please subscribe." },
            { status: 402, headers: { "Cache-Control": "no-store" } }
        );
    }

    await prisma.toolUsage.create({
        data: { visitorId: visitor.id, tool },
    });

    return NextResponse.json(
        { ok: true, consumed: true },
        { headers: { "Cache-Control": "no-store" } }
    );
}
