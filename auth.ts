import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import Email from "next-auth/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: { strategy: "database" },

    // Env inference: AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET etc.
    providers: [
        Google,
        Facebook,
        Email({
            server: process.env.EMAIL_SERVER!,
            from: process.env.EMAIL_FROM!,
        }),
    ],

    callbacks: {
        // Link existing dc_vid visitor usage to the logged-in user (optional but recommended)
        async signIn({ user }) {
            try {
                const jar = await cookies(); // Next.js: await cookies()
                const dcVid = jar.get("dc_vid")?.value;
                if (dcVid && user?.id) {
                    await prisma.visitor.updateMany({
                        where: { dcVid, userId: null },
                        data: { userId: user.id },
                    });
                }
            } catch {
                // don’t block sign-in if linking fails
            }
            return true;
        },
    },
});
