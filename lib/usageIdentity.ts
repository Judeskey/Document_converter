import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";


export async function getUsageIdentity() {
    const session = await auth();
    const userId = (session?.user as any)?.id as string | undefined;

    // If signed in, use userId (best)
    if (userId) return { userId, visitorId: null as string | null };

    // Else use visitor cookie
    const jar = await cookies();
    const dcVid = jar.get("dc_vid")?.value;

    if (!dcVid) return { userId: null as string | null, visitorId: null as string | null };

    const visitor = await prisma.visitor.upsert({
        where: { dcVid },
        update: {},
        create: { dcVid },
        select: { id: true },
    });

    return { userId: null as string | null, visitorId: visitor.id };
}
