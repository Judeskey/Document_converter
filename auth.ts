import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import Resend from "next-auth/providers/resend";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

const VISITOR_COOKIE = "dc_vid";

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "database",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },

    pages: {
        signIn: "/signin",
        verifyRequest: "/signin?check-email=1",
    },

    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
        }),
        Facebook({
            clientId: process.env.AUTH_FACEBOOK_ID!,
            clientSecret: process.env.AUTH_FACEBOOK_SECRET!,
        }),
        Resend({
            apiKey: process.env.RESEND_API_KEY!,
            from: process.env.EMAIL_FROM!,
        }),
    ],

    callbacks: {
        async session({ session, user }) {
            if (session.user) (session.user as any).id = user.id;
            return session;
        },
    },

    events: {
        async signIn({ user }) {
            if (!user?.id) return;
            const userId = user.id;

            // Import cookies lazily so this file stays server-safe
            const jar = await import("next/headers").then((m) => m.cookies());
            const dcVid = jar.get(VISITOR_COOKIE)?.value;
            if (!dcVid) return;

            const visitor = await prisma.visitor.findUnique({
                where: { dcVid },
                select: { id: true },
            });
            if (!visitor) return;

            const visitorRows = await prisma.toolUsage.findMany({
                where: { visitorId: visitor.id },
                select: { tool: true, count: true },
            });
            if (visitorRows.length === 0) return;

            for (const r of visitorRows) {
                await prisma.toolUsage.upsert({
                    where: {
                        tool_userId: {
                            tool: r.tool,
                            userId,
                        },
                    },
                    update: { count: { increment: r.count } },
                    create: { tool: r.tool, userId, count: r.count },
                });
            }

            await prisma.toolUsage.deleteMany({
                where: { visitorId: visitor.id },
            });
        },
    },
});
