import { NextResponse } from "next/server";
import { isUserPro } from "@/lib/billing/isPro"; // adjust if you already have this
import { canUseTool } from "@/lib/usage/check";  // adjust if you already have this

type GateArgs = { user: any; tool: string };

export async function gateToolOrThrow({ user, tool }: GateArgs) {
    if (!user) {
        throw NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const pro = await isUserPro(user.id);
    if (pro) return;

    const ok = await canUseTool({ userId: user.id, tool });
    if (!ok) {
        throw NextResponse.json({ error: "Pro required" }, { status: 402 });
    }
}
