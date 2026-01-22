import { NextResponse } from "next/server";

function maskDb(url?: string) {
    if (!url) return null;
    // hide password in postgresql://user:pass@host/db
    return url.replace(/:(.*?)@/, ":***@");
}

export async function GET() {
    const databaseUrl = process.env.DATABASE_URL;
    const directUrl = process.env.DIRECT_URL;

    return NextResponse.json({
        nodeEnv: process.env.NODE_ENV,
        // Auth core
        hasAuthSecret: !!process.env.AUTH_SECRET,
        authUrl: process.env.AUTH_URL || process.env.NEXTAUTH_URL || null,

        // OAuth
        hasGoogleId: !!process.env.AUTH_GOOGLE_ID,
        hasGoogleSecret: !!process.env.AUTH_GOOGLE_SECRET,
        hasFacebookId: !!process.env.AUTH_FACEBOOK_ID,
        hasFacebookSecret: !!process.env.AUTH_FACEBOOK_SECRET,

        // Email provider
        hasEmailServer: !!process.env.EMAIL_SERVER,
        emailFrom: process.env.EMAIL_FROM || null,

        // Database (most important)
        hasDatabaseUrl: !!databaseUrl,
        databaseUrlHost: databaseUrl
            ? (() => {
                try {
                    return new URL(databaseUrl).host;
                } catch {
                    return "INVALID_DATABASE_URL_FORMAT";
                }
            })()
            : null,
        databaseUrlMasked: maskDb(databaseUrl),
        directUrlMasked: maskDb(directUrl),
    });
}
