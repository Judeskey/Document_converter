import { auth } from "@/auth";
import { prisma } from "@/lib/db"; // ✅ use the same prisma import you use in auth.ts

export type Plan = "FREE" | "PRO";

export async function getAuthedUserOrThrow() {
    const session = await auth();
    const email = session?.user?.email;
    if (!email) return null;

    const user = await prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            email: true,
            plan: true,
            subscriptionStatus: true,
            stripeCurrentPeriodEnd: true,
        },
    });

    return user;
}

export async function requirePro() {
    const user = await getAuthedUserOrThrow();
    if (!user) return { ok: false as const, status: 401, message: "Unauthorized" };

    // ✅ DB truth (updated by webhook)
    const isPro =
        user.plan === "PRO" &&
        (user.subscriptionStatus === "active" || user.subscriptionStatus === "trialing");

    if (!isPro) {
        return { ok: false as const, status: 402, message: "Upgrade required" };
    }

    return { ok: true as const, user };
}
