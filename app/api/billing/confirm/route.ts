import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/db";



export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function jsonError(status: number, payload: any) {
    return NextResponse.json(payload, { status });
}

export async function POST(req: Request) {
    try {
        const { session_id } = await req.json().catch(() => ({}));
        if (!session_id) return jsonError(400, { error: "Missing session_id" });

        const stripeSecret = process.env.STRIPE_SECRET_KEY;
        if (!stripeSecret) return jsonError(500, { error: "Missing STRIPE_SECRET_KEY" });

        const stripe = new Stripe(stripeSecret);

        // Get checkout session
        const cs = await stripe.checkout.sessions.retrieve(session_id);

        // Email (most reliable)
        const email =
            (cs.customer_details?.email || cs.customer_email || cs.metadata?.userEmail || "").trim();

        if (!email) {
            return jsonError(400, { error: "Could not determine customer email from session" });
        }

        const subId = typeof cs.subscription === "string" ? cs.subscription : cs.subscription?.id;
        const customerId = typeof cs.customer === "string" ? cs.customer : cs.customer?.id;

        if (!subId) return jsonError(400, { error: "No subscription on session" });

        const sub = await stripe.subscriptions.retrieve(subId);

        const status = sub.status; // active | trialing | past_due | canceled...
        const isPro = status === "active" || status === "trialing";

        const priceId = (sub.items?.data?.[0]?.price?.id || null) as string | null;

        // current_period_end exists on real object, but your TS types complain -> use any safely
        const periodEndUnix = (sub as any)?.current_period_end ?? null;
        const periodEnd = periodEndUnix ? new Date(periodEndUnix * 1000) : null;

        // Update user row by email (must persist plan/subscription fields)
        await prisma.user.update({
            where: { email },
            data: {
                plan: isPro ? "PRO" : "FREE",
                subscriptionStatus: status,
                stripeCustomerId: customerId || undefined,
                stripeSubscriptionId: subId,
                stripePriceId: priceId || undefined,
                stripeCurrentPeriodEnd: periodEnd || undefined,
            },
        });

        return NextResponse.json({ ok: true, email, isPro, status });
    } catch (err: any) {
        console.error("Billing confirm error:", err);
        return jsonError(500, {
            error: "Confirm failed",
            message: err?.message ?? String(err),
            type: err?.type,
            code: err?.code,
        });
    }
}
