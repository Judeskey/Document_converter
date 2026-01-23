import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth"; // must export `auth` from your NextAuth setup

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-06-20",
});

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

        // 1) Ensure Stripe customer exists
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

        // 2) Create Stripe Checkout Session (subscription)
        const priceId = process.env.STRIPE_PRICE_PRO_MONTHLY!;
        const baseUrl = process.env.AUTH_URL!; // https://docconvertor.com

        const checkout = await stripe.checkout.sessions.create({
            mode: "subscription",
            customer: customerId,
            line_items: [{ price: priceId, quantity: 1 }],
            allow_promotion_codes: true,

            // Optional: collect billing address
            billing_address_collection: "auto",

            // Useful metadata
            metadata: { userId: user.id },

            success_url: `${baseUrl}/account?checkout=success`,
            cancel_url: `${baseUrl}/pricing?checkout=cancel`,
        });

        return NextResponse.json({ url: checkout.url }, { status: 200 });
    } catch (err: any) {
        console.error("[billing.checkout] error", err);
        return NextResponse.json(
            { error: "Checkout session failed" },
            { status: 500 }
        );
    }
}
