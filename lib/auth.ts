import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import Email from "next-auth/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";

const VISITOR_COOKIE = "dc_vid";

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: { strategy: "database" },

    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
        }),
        Facebook({
            clientId: process.env.AUTH_FACEBOOK_ID!,
            clientSecret: process.env.AUTH_FACEBOOK_SECRET!,
        }),
        Email({
            server: process.env.EMAIL_SERVER!,
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
            // Type guard: Prisma adapter always provides user.id, but TS doesn't know
            if (!user?.id) return;

            const userId = user.id;

            const jar = await import("next/headers").then((m) => m.cookies());
            const dcVid = jar.get("dc_vid")?.value;
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
                            userId, // ✅ now definitely string
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
