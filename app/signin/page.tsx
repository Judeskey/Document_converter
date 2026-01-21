"use client";

import { signIn } from "next-auth/react";

export default function SignInPage() {
    return (
        <main className="mx-auto max-w-md p-6">
            <h1 className="text-2xl font-bold">Sign in</h1>
            <p className="mt-2 text-neutral-600">
                Sign in to unlock unlimited conversions after your free trial.
            </p>

            <button
                className="mt-6 w-full rounded-xl bg-black px-4 py-3 text-white"
                onClick={() => signIn("google", { callbackUrl: "/" })}
            >
                Continue with Google
            </button>
        </main>
    );
}
