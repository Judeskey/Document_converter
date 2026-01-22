import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // adjust if your path differs

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const result = await prisma.$queryRaw`SELECT 1 as ok`;
        return NextResponse.json({ ok: true, result });
    } catch (e: any) {
        return NextResponse.json(
            { ok: false, error: e?.message ?? String(e) },
            { status: 500 }
        );
    }
}
