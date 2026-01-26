"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function BillingSuccessClient() {
    const sp = useSearchParams();
    const [msg, setMsg] = useState("Finalizing your subscription...");

    useEffect(() => {
        const session_id = sp.get("session_id");

        if (!session_id) {
            setMsg("Missing session id. Please contact support.");
            return;
        }

        let cancelled = false;

        (async () => {
            try {
                const res = await fetch("/api/billing/confirm", {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({ session_id }),
                });

                const data = await res.json().catch(() => ({}));

                if (!res.ok) {
                    if (!cancelled) setMsg(data?.error || "Could not finalize subscription.");
                    return;
                }

                if (!cancelled) {
                    setMsg("✅ Subscription activated. Redirecting...");
                    setTimeout(() => {
                        window.location.href = "/";
                    }, 900);
                }
            } catch (e: any) {
                if (!cancelled) setMsg(e?.message || "Network error while finalizing subscription.");
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [sp]);

    return (
        <div className="mx-auto max-w-xl p-8">
            <h1 className="text-2xl font-semibold">Payment success</h1>
            <p className="mt-3 text-sm opacity-80">{msg}</p>
        </div>
    );
}
