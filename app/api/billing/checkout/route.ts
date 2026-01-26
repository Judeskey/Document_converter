import { NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@/auth";

export const runtime = "nodejs";

function jsonError(status: number, payload: any) {
    return NextResponse.json(payload, { status });
}

export async function POST(req: Request) {
    try {
        // 1) AUTH
        const session = await auth();
        if (!session?.user?.email) {
            return jsonError(401, { error: "Unauthorized" });
        }

        // 2) ENV
        const missing: string[] = [];
        const stripeSecret = process.env.STRIPE_SECRET_KEY;
        const proPriceId = process.env.STRIPE_PRICE_PRO_MONTHLY;

        if (!stripeSecret) missing.push("STRIPE_SECRET_KEY");
        if (!proPriceId) missing.push("STRIPE_PRICE_PRO_MONTHLY");

        const appUrl =
            process.env.NEXT_PUBLIC_APP_URL ||
            process.env.NEXTAUTH_URL ||
            "http://localhost:3000";

        if (!appUrl) missing.push("NEXT_PUBLIC_APP_URL (or NEXTAUTH_URL)");

        if (missing.length) {
            return jsonError(500, {
                error: "Missing Stripe env vars",
                missing,
                seen: {
                    STRIPE_SECRET_KEY: !!stripeSecret,
                    STRIPE_PRICE_PRO_MONTHLY: !!proPriceId,
                    NEXT_PUBLIC_APP_URL: !!process.env.NEXT_PUBLIC_APP_URL,
                    NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
                },
            });
        }

        // 3) STRIPE INIT (don’t pin apiVersion to avoid TS errors)
        const stripe = new Stripe(stripeSecret!);

        // 4) optional body
        let country: string | undefined;
        let province: string | undefined;
        try {
            const body = await req.json();
            country = body?.country;
            province = body?.province;
        } catch { }

        // 5) Checkout Session
        const checkout = await stripe.checkout.sessions.create({
            mode: "subscription",
            customer_email: session.user.email,
            line_items: [{ price: proPriceId!, quantity: 1 }],
            success_url: `${appUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${appUrl}/billing/cancel`,
            metadata: {
                userEmail: session.user.email,
                country: country || "",
                province: province || "",
            },
        });

        return NextResponse.json({ url: checkout.url });
    } catch (err: any) {
        console.error("Checkout error:", err);
        return jsonError(500, {
            error: "Checkout failed",
            message: err?.message ?? String(err),
            type: err?.type,
            code: err?.code,
        });
    }
}
