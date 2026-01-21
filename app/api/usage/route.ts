import { NextResponse } from "next/server";

const COOKIE_NAME = "dc_free_used";

export async function GET(req: Request) {
    const cookie = req.headers.get("cookie") || "";
    const used = cookie.includes(`${COOKIE_NAME}=1`);

    return NextResponse.json(
        { freeUsed: used },
        { status: 200, headers: { "Cache-Control": "no-store" } }
    );
}

export async function POST() {
    const res = NextResponse.json(
        { ok: true },
        { status: 200, headers: { "Cache-Control": "no-store" } }
    );

    res.headers.append(
        "Set-Cookie",
        `${COOKIE_NAME}=1; Path=/; Max-Age=${60 * 60 * 24 * 180}; SameSite=Lax`
    );

    return res;
}
