import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";

const VISITOR_COOKIE = "dc_vid";

function isProStatus(status?: string | null) {
    return status === "active" || status === "trialing";
}

export async function gateToolOrThrow(tool: string) {
    const session = await auth();
    const email = session?.user?.email ?? null;

    if (email) {
        const user = await prisma.user.findUnique({
            where: { email },
            select: { id: true, plan: true, subscriptionStatus: true },
        });

        if (!user) return { allowed: false as const, status: 401, message: "Unauthorized" };

        // ✅ Pro if plan is PRO OR Stripe status is active/trialing
        const isPro = user.plan === "PRO" || isProStatus(user.subscriptionStatus);
        if (isPro) return { allowed: true as const };

        const row = await prisma.toolUsage.findUnique({
            where: { tool_userId: { tool, userId: user.id } },
            select: { count: true },
        });

        if ((row?.count ?? 0) >= 1) {
            return { allowed: false as const, status: 402, message: "Upgrade required" };
        }

        return { allowed: true as const };
    }

    // ✅ Next.js 16: cookies() is async
    const jar = await cookies();
    const dcVid = jar.get(VISITOR_COOKIE)?.value;
    if (!dcVid) return { allowed: true as const };

    const visitor = await prisma.visitor.findUnique({
        where: { dcVid },
        select: { id: true },
    });
    if (!visitor) return { allowed: true as const };

    const row = await prisma.toolUsage.findUnique({
        where: { tool_visitorId: { tool, visitorId: visitor.id } },
        select: { count: true },
    });

    if ((row?.count ?? 0) >= 1) {
        return { allowed: false as const, status: 402, message: "Sign in / upgrade required" };
    }

    return { allowed: true as const };
}

export async function recordToolUse(tool: string) {
    const session = await auth();
    const email = session?.user?.email ?? null;

    if (email) {
        const user = await prisma.user.findUnique({
            where: { email },
            select: { id: true },
        });
        if (!user) return;

        await prisma.toolUsage.upsert({
            where: { tool_userId: { tool, userId: user.id } },
            update: { count: { increment: 1 } },
            create: { tool, userId: user.id, count: 1 },
        });
        return;
    }

    // ✅ Next.js 16: cookies() is async
    const jar = await cookies();
    const dcVid = jar.get(VISITOR_COOKIE)?.value;
    if (!dcVid) return;

    const visitor = await prisma.visitor.findUnique({
        where: { dcVid },
        select: { id: true },
    });
    if (!visitor) return;

    await prisma.toolUsage.upsert({
        where: { tool_visitorId: { tool, visitorId: visitor.id } },
        update: { count: { increment: 1 } },
        create: { tool, visitorId: visitor.id, count: 1 },
    });
}
