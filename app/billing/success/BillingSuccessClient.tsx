"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { isProUser } from "@/lib/isPro";

export default function BillingSuccessClient() {
    const router = useRouter();
    const params = useSearchParams();
    const sessionId = params.get("session_id");

    const [msg, setMsg] = useState("Finalizing your subscription...");
    const [tries, setTries] = useState(0);

    useEffect(() => {
        let alive = true;

        const tick = async () => {
            try {
                const res = await fetch("/api/billing/me", { cache: "no-store" });
                const data = await res.json();

                if (!alive) return;

                if (res.ok && data?.ok && isProUser(data.user)) {
                    setMsg("✅ Subscription active! Redirecting...");
                    // send them somewhere useful
                    router.replace("/account");
                    return;
                }

                setTries((t) => t + 1);
                setMsg(
                    "Payment succeeded, but activation is taking longer than expected. Refresh in a moment."
                );
            } catch {
                if (!alive) return;
                setTries((t) => t + 1);
                setMsg(
                    "Payment succeeded, but we couldn't confirm activation yet. Check your webhook/Stripe listen."
                );
            }
        };

        // poll up to ~30 seconds
        const interval = setInterval(() => {
            tick();
        }, 3000);

        // run immediately once
        tick();

        const timeout = setTimeout(() => {
            clearInterval(interval);
        }, 30000);

        return () => {
            alive = false;
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [router, sessionId]);

    return (
        <div className="mx-auto max-w-xl p-8">
            <h1 className="text-2xl font-semibold">Payment success</h1>
            <p className="mt-3 text-sm opacity-80">{msg}</p>

            <div className="mt-6 flex gap-3">
                <Link className="rounded-md bg-black px-4 py-2 text-white" href="/">
                    Go to Home
                </Link>
                <Link className="rounded-md border px-4 py-2" href="/pricing">
                    Pricing
                </Link>
            </div>

            <p className="mt-6 text-xs opacity-70">
                If this keeps happening, your webhook may not be reaching the app.
                Confirm <code>stripe listen</code> is running locally (test) or Stripe
                webhook is configured in production (live).
            </p>
        </div>
    );
}
