"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButton() {
    const { data: session, status } = useSession();

    // status: "loading" | "authenticated" | "unauthenticated"
    if (status === "loading") {
        return (
            <button
                type="button"
                disabled
                className="rounded-full px-4 py-2 text-sm border opacity-70"
            >
                Loading...
            </button>
        );
    }

    if (status === "authenticated") {
        const name = session.user?.name || session.user?.email || "Account";
        return (
            <div className="flex items-center gap-3">
                <span className="text-sm text-neutral-700">{name}</span>
                <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="rounded-full px-4 py-2 text-sm border hover:bg-neutral-50"
                >
                    Sign out
                </button>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3">
            <button
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/" })}
                className="rounded-full px-4 py-2 text-sm bg-black text-white hover:opacity-90"
            >
                Continue with Google
            </button>

            <button
                type="button"
                onClick={() => signIn("facebook", { callbackUrl: "/" })}
                className="rounded-full px-4 py-2 text-sm bg-[#1877F2] text-white hover:opacity-90"
            >
                Continue with Facebook
            </button>
        </div>
    );
}
