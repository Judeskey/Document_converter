"use client";

import { useEffect, useState } from "react";

type BillingMe =
    | { ok: true; user: { plan?: string } }
    | { ok: false; error?: string };

export default function GoProButton() {
    const [loading, setLoading] = useState(true);
    const [isPro, setIsPro] = useState(false);

    // Optional: hide button when definitely PRO (fail-open if /api/billing/me missing/broken)
    useEffect(() => {
        let alive = true;

        (async () => {
            try {
                const res = await fetch("/api/billing/me", { cache: "no-store" });
                if (!res.ok) throw new Error("billing/me not available");

                const data = (await res.json().catch(() => null)) as BillingMe | null;
                const plan = (data as any)?.user?.plan;
                if (alive) setIsPro(String(plan || "").toUpperCase() === "PRO");
            } catch {
                // fail-open: keep it visible
                if (alive) setIsPro(false);
            } finally {
                if (alive) setLoading(false);
            }
        })();

        return () => {
            alive = false;
        };
    }, []);

    async function goPro() {
        try {
            const res = await fetch("/api/billing/checkout", { method: "POST" });

            if (res.status === 401) {
                const cb = encodeURIComponent(window.location.pathname + window.location.search);
                window.location.href = `/signin?callbackUrl=${cb}`;
                return;
            }

            const ct = res.headers.get("content-type") || "";
            const data = ct.includes("application/json")
                ? await res.json().catch(() => ({}))
                : { error: await res.text().catch(() => "Unable to start checkout") };

            if (!res.ok) {
                alert((data as any)?.error || "Unable to start checkout");
                return;
            }

            const url = (data as any)?.url;
            if (!url) {
                alert("Checkout URL missing from server response.");
                return;
            }

            window.location.href = url;
        } catch (e: any) {
            alert(e?.message || "Unable to start checkout");
        }
    }

    // If confirmed PRO, hide it
    if (!loading && isPro) return null;

    return (
        <button
            onClick={goPro}
            className="rounded-md bg-black px-4 py-2 text-white hover:opacity-90"
            type="button"
        >
            Go Pro
        </button>
    );
}
