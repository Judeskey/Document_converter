import { cookies } from "next/headers";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export const VISITOR_COOKIE = "dc_vid";
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 180; // 180 days

export async function getOrCreateVisitorIdentity() {
    const store = await cookies(); // ✅ Next 16.1+ returns Promise
    let dcVid = store.get(VISITOR_COOKIE)?.value || null;
    const isNew = !dcVid;

    if (!dcVid) dcVid = crypto.randomUUID();

    // ensure Visitor exists
    const visitor = await prisma.visitor.upsert({
        where: { dcVid },
        update: {},
        create: { dcVid },
        select: { id: true },
    });

    return { store, dcVid, visitorId: visitor.id, isNew };
}
