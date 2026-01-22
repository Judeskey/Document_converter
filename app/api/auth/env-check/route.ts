import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    return NextResponse.json({
        hasAuthSecret: !!process.env.AUTH_SECRET,
        hasGoogleId: !!process.env.AUTH_GOOGLE_ID,
        hasGoogleSecret: !!process.env.AUTH_GOOGLE_SECRET,
        hasFacebookId: !!process.env.AUTH_FACEBOOK_ID,
        hasFacebookSecret: !!process.env.AUTH_FACEBOOK_SECRET,
        nodeEnv: process.env.NODE_ENV,
    });
}
