// File: app/api/billing/checkout/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {
    try {
        const session = await auth();
        const email = session?.user?.email;

        if (!email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Ensure Stripe customer exists
        let customerId = user.stripeCustomerId;
        if (!customerId) {
            const customer = await stripe.customers.create({
                email: user.email ?? undefined,
                name: user.name ?? undefined,
                metadata: { userId: user.id },
            });

            customerId = customer.id;

            await prisma.user.update({
                where: { id: user.id },
                data: { stripeCustomerId: customerId },
            });
        }

        const priceId = process.env.STRIPE_PRICE_PRO_MONTHLY!;
        const baseUrl = process.env.AUTH_URL!; // http://localhost:3000 or https://docconvertor.com

        const checkout = await stripe.checkout.sessions.create({
            mode: "subscription",
            customer: customerId,
            line_items: [{ price: priceId, quantity: 1 }],
            allow_promotion_codes: true,

            // ✅ Stripe Tax (automatic GST/HST for Canada; outside Canada stays untaxed if you're only registered in Canada)
            automatic_tax: { enabled: true },

            // ✅ Make address collection required so Stripe can determine province for GST/HST
            billing_address_collection: "required",

            // ✅ Save address onto the Customer automatically
            customer_update: {
                address: "auto",
                name: "auto",
            },

            // ✅ tracking
            client_reference_id: user.id,
            metadata: { userId: user.id },

            // ✅ redirects
            success_url: `${baseUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${baseUrl}/billing/cancel`,
        });

        return NextResponse.json({ url: checkout.url }, { status: 200 });
    } catch (err: any) {
        console.error("[billing.checkout] error", err);
        return NextResponse.json({ error: "Checkout session failed" }, { status: 500 });
    }
}
