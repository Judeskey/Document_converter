// lib/billing-client.ts
export type BillingUser = {
    email?: string | null;
    plan?: "FREE" | "PRO" | string | null;
    subscriptionStatus?: string | null;
    stripeCustomerId?: string | null;
    stripeSubscriptionId?: string | null;
    stripePriceId?: string | null;
    stripeCurrentPeriodEnd?: string | Date | null;
};

export function isProUser(user?: BillingUser | null) {
    if (!user) return false;
    const plan = String(user.plan || "").toUpperCase();
    const status = String(user.subscriptionStatus || "").toLowerCase();
    return plan === "PRO" && (status === "active" || status === "trialing");
}
