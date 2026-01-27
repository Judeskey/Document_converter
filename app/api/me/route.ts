import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
    const session = await auth();
    const email = session?.user?.email;

    if (!email) {
        return NextResponse.json(
            { ok: false, error: "UNAUTHENTICATED" },
            { status: 401 }
        );
    }

    const user = await prisma.user.findUnique({
        where: { email },
        select: {
            email: true,
            plan: true,
            subscriptionStatus: true,
            stripeCustomerId: true,
            stripeSubscriptionId: true,
            stripePriceId: true,
            stripeCurrentPeriodEnd: true,
        },
    });

    if (!user) {
        return NextResponse.json(
            { ok: false, error: "USER_NOT_FOUND" },
            { status: 404 }
        );
    }

    return NextResponse.json({ ok: true, user }, { status: 200 });
}
