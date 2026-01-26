import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
    try {
        const session = await auth();
        const email = session?.user?.email;

        if (!email) {
            return NextResponse.json({ signedIn: false, isPro: false });
        }

        const user = await prisma.user.findUnique({
            where: { email },
            select: { plan: true, subscriptionStatus: true },
        });

        const isPro =
            user?.plan === "PRO" ||
            user?.subscriptionStatus === "active" ||
            user?.subscriptionStatus === "trialing";

        return NextResponse.json({ signedIn: true, isPro });
    } catch (e) {
        // Never throw HTML. Always return JSON.
        return NextResponse.json({ signedIn: false, isPro: false });
    }
}
