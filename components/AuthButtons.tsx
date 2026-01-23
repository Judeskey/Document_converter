"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";

type Props = {
    variant?: "header" | "page";
    callbackUrl?: string;
};

export default function AuthButtons({ variant = "page", callbackUrl = "/" }: Props) {
    const { data: session, status } = useSession();

    const [email, setEmail] = useState("");
    const [sendingEmail, setSendingEmail] = useState(false);
    const [emailMsg, setEmailMsg] = useState<string | null>(null);

    // ===== Header mode: ONE button only (or user+sign out) =====
    if (variant === "header") {
        if (status === "loading") {
            return <div className="h-9 w-24 animate-pulse rounded-full bg-neutral-200" />;
        }

        if (!session?.user) {
            return (
                <Link
                    href="/signin"
                    className="inline-flex h-9 items-center rounded-full border border-neutral-300 bg-white px-4 text-sm font-medium text-neutral-900 hover:bg-neutral-50"
                >
                    Sign in
                </Link>
            );
        }

        const displayName = session.user.name ?? session.user.email?.split("@")[0] ?? "Account";

        return (
            <div className="flex items-center gap-3">
                <div className="max-w-[200px] truncate text-sm font-medium text-neutral-800">
                    {displayName}
                </div>

                <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="inline-flex h-9 items-center rounded-full bg-black px-4 text-sm font-medium text-white hover:bg-neutral-800"
                >
                    Sign out
                </button>
            </div>
        );
    }

    // ===== Page mode: FULL auth options for /signin page =====
    return (
        <div className="w-full max-w-md space-y-3">
            <button
                type="button"
                onClick={() => signIn("google", { callbackUrl })}
                className="w-full rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
            >
                Continue with Google
            </button>

            <button
                type="button"
                onClick={() => signIn("facebook", { callbackUrl })}
                className="w-full rounded-xl bg-[#1877F2] px-4 py-3 text-sm font-semibold text-white hover:opacity-95"
            >
                Continue with Facebook
            </button>

            <div className="flex w-full items-stretch gap-2">
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email for magic link"
                    className="h-12 w-full rounded-xl border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-neutral-500"
                />

                <button
                    type="button"
                    disabled={sendingEmail}
                    onClick={async () => {
                        const trimmed = email.trim();
                        if (!trimmed) return;

                        setEmailMsg(null);
                        setSendingEmail(true);

                        try {
                            // ✅ IMPORTANT:
                            // 1) provider id must be "resend" (not "email")
                            // 2) redirect:false prevents navigation to /api/auth/*
                            const res = await signIn("resend", {
                                email: trimmed,
                                callbackUrl,
                                redirect: false,
                            });

                            if (res?.error) {
                                setEmailMsg("Email sign-in failed. Check server logs / env vars.");
                            } else {
                                setEmailMsg("Magic link sent. Check your inbox (and spam).");
                            }
                        } catch {
                            setEmailMsg("Email sign-in failed. Check server logs / env vars.");
                        } finally {
                            setSendingEmail(false);
                        }
                    }}
                    className="h-12 whitespace-nowrap rounded-xl border border-neutral-300 bg-white px-4 text-sm font-semibold hover:bg-neutral-50 disabled:opacity-60"
                >
                    {sendingEmail ? "Sending..." : "Continue with Email"}
                </button>
            </div>

            {emailMsg ? (
                <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-800">
                    {emailMsg}
                </div>
            ) : null}
        </div>
    );
}
