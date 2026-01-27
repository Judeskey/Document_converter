import Stripe from "stripe";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

function toDateFromStripeUnixSeconds(n: unknown) {
    return typeof n === "number" ? new Date(n * 1000) : null;
}

async function setUserPlanFromSubscription(params: {
    userId?: string | null;
    customerId?: string | null;
    subscriptionId?: string | null;
}) {
    const { userId, customerId, subscriptionId } = params;

    if (!subscriptionId && !customerId) return;

    // Fetch the subscription if we have it
    let sub: Stripe.Subscription | null = null;
    if (subscriptionId) {
        sub = await stripe.subscriptions.retrieve(subscriptionId);
    }

    // If we don’t have subscriptionId but have customerId, try to find active subscription
    if (!sub && customerId) {
        const subs = await stripe.subscriptions.list({ customer: customerId, limit: 1 });
        sub = subs.data?.[0] ?? null;
    }

    if (!sub) return;

    const customer =
        typeof sub.customer === "string" ? sub.customer : sub.customer.id;

    const status = String(sub.status || "").toLowerCase();
    const priceId = sub.items?.data?.[0]?.price?.id ?? null;
    const stripeCurrentPeriodEnd = toDateFromStripeUnixSeconds((sub as any)?.current_period_end);
    const isPro = status === "active" || status === "trialing";

    // Update by userId if possible, else by customerId
    if (userId) {
        await prisma.user.update({
            where: { id: userId },
            data: {
                stripeCustomerId: customer ?? undefined,
                stripeSubscriptionId: sub.id,
                stripePriceId: priceId ?? undefined,
                stripeCurrentPeriodEnd: stripeCurrentPeriodEnd ?? undefined,
                subscriptionStatus: status,
                plan: isPro ? "PRO" : "FREE",
            },
        });
    } else if (customer) {
        await prisma.user.updateMany({
            where: { stripeCustomerId: customer },
            data: {
                stripeSubscriptionId: sub.id,
                stripePriceId: priceId ?? undefined,
                stripeCurrentPeriodEnd: stripeCurrentPeriodEnd ?? undefined,
                subscriptionStatus: status,
                plan: isPro ? "PRO" : "FREE",
            },
        });
    }
}

export async function POST(req: Request) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    const sig = req.headers.get("stripe-signature");
    if (!sig) return new Response("Missing Stripe signature", { status: 400 });

    const body = await req.text();

    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err: any) {
        return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    try {
        // ✅ 1) This is the “instant persist” event after checkout
        if (event.type === "checkout.session.completed") {
            const session = event.data.object as Stripe.Checkout.Session;

            const userId =
                (session.metadata?.userId as string | undefined) ??
                (session.client_reference_id as string | undefined) ??
                undefined;

            const customerId =
                typeof session.customer === "string" ? session.customer : session.customer?.id;

            const subscriptionId =
                typeof session.subscription === "string"
                    ? session.subscription
                    : session.subscription?.id;

            await setUserPlanFromSubscription({ userId, customerId, subscriptionId });
        }

        // ✅ 2) Also handle lifecycle updates
        if (
            event.type === "customer.subscription.created" ||
            event.type === "customer.subscription.updated" ||
            event.type === "customer.subscription.deleted"
        ) {
            const sub = event.data.object as Stripe.Subscription;
            const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
            await setUserPlanFromSubscription({
                customerId,
                subscriptionId: sub.id,
            });
        }

        return new Response("ok", { status: 200 });
    } catch (e: any) {
        console.error("[stripe.webhook] handler error:", e);
        return new Response("Webhook handler failed", { status: 500 });
    }
}
