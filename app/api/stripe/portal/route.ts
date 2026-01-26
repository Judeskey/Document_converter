import Stripe from "stripe";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {
    const session = await auth();
    const userId = (session as any)?.user?.id as string | undefined;

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

    // Create Stripe customer if missing (same pattern as checkout)
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

    const returnUrl =
        process.env.NEXT_PUBLIC_APP_URL
            ? `${process.env.NEXT_PUBLIC_APP_URL}/pricing`
            : "http://localhost:3000/pricing";

    const portal = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
    });

    return NextResponse.json({ url: portal.url }, { status: 200 });
}
