import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { prisma } from "@/lib/db"; // or "@/lib/db"
import { auth } from "@/auth";

const VISITOR_COOKIE = "dc_vid";

// Get or create the cookie value (Visitor.dcVid)
async function getOrSetDcVid(): Promise<string> {
    const store = await cookies();
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
        where: { dcVid },
        update: {},
        create: { dcVid },
        select: { id: true, dcVid: true },
    });

    return visitor;
}

function noStoreJson(body: any, init?: { status?: number }) {
    return NextResponse.json(body, {
        status: init?.status ?? 200,
        headers: { "Cache-Control": "no-store" },
    });
}

/**
 * GET → check if free use remains for this tool
 */
export async function GET(
    _req: NextRequest,
    context: { params: Promise<{ tool: string }> }
) {
    const { tool } = await context.params;

    // 1) If signed in, key by userId
    const session = await auth();
    const userId = (session?.user as any)?.id as string | undefined;

    if (userId) {
        const row = await prisma.toolUsage.findUnique({
            where: { tool_userId: { tool, userId } },
            select: { count: true },
        });

        const count = row?.count ?? 0;
        return noStoreJson({
            tool,
            count,
            freeUsed: count >= 1,
            freeRemaining: count >= 1 ? 0 : 1,
        });
    }

    // 2) Otherwise fallback to visitor cookie
    const visitor = await ensureVisitor();

    const row = await prisma.toolUsage.findUnique({
        where: { tool_visitorId: { tool, visitorId: visitor.id } }, // ✅ correct order
        select: { count: true },
    });

    const count = row?.count ?? 0;
    return noStoreJson({
        tool,
        count,
        freeUsed: count >= 1,
        freeRemaining: count >= 1 ? 0 : 1,
    });
}

/**
 * POST → consume free use (ONLY after successful conversion)
 */
export async function POST(
    _req: NextRequest,
    context: { params: Promise<{ tool: string }> }
) {
    const { tool } = await context.params;

    // 1) If signed in, key by userId
    const session = await auth();
    const userId = (session?.user as any)?.id as string | undefined;

    if (userId) {
        const existing = await prisma.toolUsage.findUnique({
            where: { tool_userId: { tool, userId } },
            select: { count: true },
        });

        if ((existing?.count ?? 0) >= 1) {
            return noStoreJson(
                { error: "Free use exhausted. Please subscribe.", tool, count: existing?.count ?? 1 },
                { status: 402 }
            );
        }

        const row = await prisma.toolUsage.upsert({
            where: { tool_userId: { tool, userId } },
            update: { count: { increment: 1 } },
            create: { tool, userId, count: 1 },
            select: { count: true },
        });

        return noStoreJson({ ok: true, consumed: true, tool, count: row.count });
    }

    // 2) Otherwise visitor
    const visitor = await ensureVisitor();

    const existing = await prisma.toolUsage.findUnique({
        where: { tool_visitorId: { tool, visitorId: visitor.id } },
        select: { count: true },
    });

    if ((existing?.count ?? 0) >= 1) {
        return noStoreJson(
            { error: "Free use exhausted. Please subscribe.", tool, count: existing?.count ?? 1 },
            { status: 402 }
        );
    }

    const row = await prisma.toolUsage.upsert({
        where: { tool_visitorId: { tool, visitorId: visitor.id } },
        update: { count: { increment: 1 } },
        create: { tool, visitorId: visitor.id, count: 1 },
        select: { count: true },
    });

    return noStoreJson({ ok: true, consumed: true, tool, count: row.count });
}
