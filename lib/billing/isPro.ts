import { prisma } from "@/lib/db";

const PRO_STATUSES = new Set(["active", "trialing"]);

export type ProCheckResult = {
    isPro: boolean;
    reason: string;
};

/**
 * Backward-compatible Pro checker.
 *
 * - Keeps existing isUserPro(userId) API
 * - Adds isProDetailed(userId) for server routes
 * - Supports Stripe status + plan flag
 * - Optionally respects stripeCurrentPeriodEnd if present
 */

/** 🔹 Existing API (kept exactly for compatibility) */
export async function isUserPro(userId: string | null | undefined): Promise<boolean> {
    if (!userId) return false;

    const u = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            plan: true,
            subscriptionStatus: true,
            stripeCurrentPeriodEnd: true,
        },
    });

    if (!u) return false;

    if (u.plan === "PRO") return true;

    if (u.subscriptionStatus && PRO_STATUSES.has(u.subscriptionStatus)) {
        if (u.stripeCurrentPeriodEnd) {
            const end = new Date(u.stripeCurrentPeriodEnd).getTime();
            if (Number.isFinite(end) && end < Date.now()) return false;
        }
        return true;
    }

    return false;
}

/** 🔹 New richer checker (optional, recommended for APIs) */
export async function isProDetailed(
    userId: string | null | undefined
): Promise<ProCheckResult> {
    if (!userId) return { isPro: false, reason: "no-user" };

    const u = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            plan: true,
            subscriptionStatus: true,
            stripeCurrentPeriodEnd: true,
        },
    });

    if (!u) return { isPro: false, reason: "user-not-found" };

    if (u.plan === "PRO") return { isPro: true, reason: "plan-pro" };

    if (u.subscriptionStatus && PRO_STATUSES.has(u.subscriptionStatus)) {
        if (u.stripeCurrentPeriodEnd) {
            const end = new Date(u.stripeCurrentPeriodEnd).getTime();
            if (Number.isFinite(end) && end < Date.now()) {
                return { isPro: false, reason: "expired-period-end" };
            }
        }
        return { isPro: true, reason: `status-${u.subscriptionStatus}` };
    }

    return { isPro: false, reason: `status-${u.subscriptionStatus || "none"}` };
}
