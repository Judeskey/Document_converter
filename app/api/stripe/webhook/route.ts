import Stripe from "stripe";
import { prisma } from "@/lib/db";

export const runtime = "nodejs"; // required for Stripe signature verification

// ✅ Create Stripe client once (no apiVersion to avoid TS mismatch)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    const sig = req.headers.get("stripe-signature");

    if (!sig) {
        return new Response("Missing Stripe signature", { status: 400 });
    }

    const body = await req.text();

    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err: any) {
        return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    // ✅ Handle subscription lifecycle
    if (
        event.type === "customer.subscription.created" ||
        event.type === "customer.subscription.updated" ||
        event.type === "customer.subscription.deleted"
    ) {
        const sub = event.data.object as Stripe.Subscription;

        const customerId =
            typeof sub.customer === "string" ? sub.customer : sub.customer.id;

        const status = String(sub.status || "").toLowerCase();
        const priceId = sub.items?.data?.[0]?.price?.id ?? null;

        // ✅ typing-safe read
        const cpe = (sub as any)?.current_period_end;
        const stripeCurrentPeriodEnd =
            typeof cpe === "number" ? new Date(cpe * 1000) : null;

        const isPro = status === "active" || status === "trialing";

        await prisma.user.updateMany({
            where: { stripeCustomerId: customerId },
            data: {
                stripeSubscriptionId: sub.id,
                stripePriceId: priceId ?? undefined,
                stripeCurrentPeriodEnd: stripeCurrentPeriodEnd ?? undefined,
                subscriptionStatus: status,
                plan: isPro ? "PRO" : "FREE",
            },
        });
    }

    return new Response("ok", { status: 200 });
}
