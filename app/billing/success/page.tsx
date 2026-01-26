"use client";

import { useEffect, useState } from "react";

export default function BillingSuccessPage() {
    const [msg, setMsg] = useState("Finalizing your subscription...");

    useEffect(() => {
        const url = new URL(window.location.href);
        const session_id = url.searchParams.get("session_id");

        if (!session_id) {
            setMsg("Missing session id. Please contact support.");
            return;
        }

        (async () => {
            const res = await fetch("/api/billing/confirm", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ session_id }),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                setMsg(data?.error || "Could not finalize subscription.");
                return;
            }

            setMsg("✅ Subscription activated. Redirecting...");
            setTimeout(() => (window.location.href = "/"), 800);
        })();
    }, []);

    return (
        <div className="mx-auto max-w-xl p-8">
            <h1 className="text-2xl font-semibold">Payment success</h1>
            <p className="mt-3 text-sm opacity-80">{msg}</p>
        </div>
    );
}
