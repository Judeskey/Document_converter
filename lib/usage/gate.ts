import { NextResponse } from "next/server";
import { auth } from "@/auth"; // ✅ your root Auth.js helper
import { prisma } from "@/lib/prisma";
import { isProDetailed } from "@/lib/billing/isPro";
import { getOrCreateVisitorIdentity, VISITOR_COOKIE, COOKIE_MAX_AGE } from "@/lib/usage/identity";

/**
 * Free-once gate:
 * - Signed-in users: ToolUsage keyed by (tool, userId)
 * - Anonymous visitors: ToolUsage keyed by (tool, visitorId) where visitorId comes from Visitor table via dc_vid cookie
 * - Pro users bypass limit
 *
 * Returns identity + Pro flag. Throws a Response on denial.
 */
export async function gateToolOrThrow(tool: string) {
    const session = await auth();
    const userId = session?.user?.id ?? null;

    // If signed-in, check Pro from DB
    const pro = await isProDetailed(userId);
    if (pro.isPro) {
        return { allowed: true as const, isPro: true, userId, visitorId: null, setCookie: null as any };
    }

    // Not Pro → enforce free-once
    if (userId) {
        const row = await prisma.toolUsage.findUnique({
            where: { tool_userId: { tool, userId } },
            select: { count: true },
        });

        const used = (row?.count ?? 0) >= 1;
        if (used) {
            throw NextResponse.json(
                { error: "Free usage limit reached. Upgrade to Pro.", tool, freeUsed: true, freeRemaining: 0, isPro: false },
                { status: 402 }
            );
        }

        return { allowed: true as const, isPro: false, userId, visitorId: null, setCookie: null as any };
    }

    // Anonymous visitor flow
    const ident = await getOrCreateVisitorIdentity();

    const row = await prisma.toolUsage.findUnique({
        where: { tool_visitorId: { tool, visitorId: ident.visitorId } },
        select: { count: true },
    });

    const used = (row?.count ?? 0) >= 1;
    if (used) {
        throw NextResponse.json(
            { error: "Free usage limit reached. Upgrade to Pro.", tool, freeUsed: true, freeRemaining: 0, isPro: false },
            { status: 402 }
        );
    }

    // Return a function that lets the caller set cookie on response if needed
    const setCookie = (res: NextResponse) => {
        if (ident.isNew) {
            res.cookies.set(VISITOR_COOKIE, ident.dcVid, {
                path: "/",
                maxAge: COOKIE_MAX_AGE,
                sameSite: "lax",
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
            });
        }
    };

    return { allowed: true as const, isPro: false, userId: null, visitorId: ident.visitorId, setCookie };
}
