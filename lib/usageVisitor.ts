import { cookies } from "next/headers";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

const VISITOR_COOKIE = "dc_vid";

export async function ensureVisitor() {
    const store = await cookies();
    let dcVid = store.get(VISITOR_COOKIE)?.value;

    if (!dcVid) {
        dcVid = crypto.randomUUID();
        store.set(VISITOR_COOKIE, dcVid, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24 * 365,
        });
    }

    return prisma.visitor.upsert({
        where: { dcVid },
        update: {},
        create: { dcVid },
        select: { id: true },
    });
}
