import { NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
});

export async function POST() {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, stripeCustomerId: true },
    });

    if (!user?.email) {
        return NextResponse.json({ error: "User email missing" }, { status: 400 });
    }

    let customerId = user.stripeCustomerId;

    if (!customerId) {
        const customer = await stripe.customers.create({
            email: user.email,
            metadata: { userId },
        });

        customerId = customer.id;

        await prisma.user.update({
            where: { id: userId },
            data: { stripeCustomerId: customerId },
        });
    }

    const checkout = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer: customerId,
        line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?success=1`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=1`,
        metadata: { userId },
    });

    return NextResponse.json({ url: checkout.url }, { status: 200 });
}
