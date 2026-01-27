export function isProUser(user: any) {
    const plan = String(user?.plan || "").toUpperCase();
    const status = String(user?.subscriptionStatus || "").toLowerCase();
    return plan === "PRO" || status === "active" || status === "trialing";
}
