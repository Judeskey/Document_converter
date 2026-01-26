"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

async function readErrorMessage(res: Response) {
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
        const j = await res.json().catch(() => null);
        if ((j as any)?.error) return String((j as any).error);
        if ((j as any)?.message) return String((j as any).message);
    }
    const t = await res.text().catch(() => "");
    return t || `Request failed (${res.status})`;
}

export default function PricingClient() {
    const sp = useSearchParams();
    const [busy, setBusy] = useState(false);
    const [msg, setMsg] = useState("");

    const banner = useMemo(() => {
        const success = sp.get("success");
        const canceled = sp.get("canceled");

        if (success === "1") return { kind: "success" as const, text: "✅ Payment successful. Your Pro access should be active." };
        if (canceled === "1") return { kind: "warn" as const, text: "Payment canceled. You were not charged." };
        return null;
    }, [sp]);

    async function startCheckout() {
        setBusy(true);
        setMsg("");

        try {
            const res = await fetch("/api/billing/checkout", { method: "POST" });

            if (res.status === 401) {
                const cb = encodeURIComponent(window.location.pathname + window.location.search);
                window.location.href = `/signin?callbackUrl=${cb}`;
                return;
            }

            if (!res.ok) throw new Error(await readErrorMessage(res));

            const j = (await res.json().catch(() => null)) as { url?: string } | null;
            if (!j?.url) throw new Error("Checkout URL not returned.");
            window.location.href = j.url;
        } catch (e: any) {
            setMsg(e?.message || "Unable to start checkout.");
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="mx-auto max-w-5xl p-8">
            <h1 className="text-3xl font-semibold">Pricing</h1>
            <p className="mt-2 text-sm opacity-80">
                Upgrade to Pro to unlock unlimited access across all DocConvertor tools.
            </p>

            {banner ? (
                <div
                    className={`mt-5 rounded-xl border p-4 text-sm ${banner.kind === "success" ? "border-green-200 bg-green-50 text-green-900" : "border-amber-200 bg-amber-50 text-amber-900"
                        }`}
                >
                    {banner.text}
                </div>
            ) : null}

            {msg ? (
                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
                    {msg}
                </div>
            ) : null}

            <div className="mt-8 grid gap-6 md:grid-cols-2">
                {/* Free */}
                <div className="rounded-2xl border bg-white p-6">
                    <div className="text-sm font-semibold opacity-70">FREE</div>
                    <div className="mt-2 text-4xl font-bold">$0</div>
                    <div className="mt-1 text-sm opacity-70">Try each tool once (or limited free uses).</div>

                    <ul className="mt-5 space-y-2 text-sm">
                        <li>✅ Access all tools (limited)</li>
                        <li>✅ No signup required for basic usage</li>
                        <li>✅ Fast conversions</li>
                    </ul>

                    <div className="mt-6">
                        <a
                            href="/tools"
                            className="inline-flex w-full items-center justify-center rounded-xl border px-4 py-3 text-sm font-semibold hover:bg-gray-50"
                        >
                            Browse tools
                        </a>
                    </div>
                </div>

                {/* Pro */}
                <div className="rounded-2xl border bg-white p-6">
                    <div className="text-sm font-semibold text-indigo-700">PRO</div>
                    <div className="mt-2 text-4xl font-bold">$9.99</div>
                    <div className="mt-1 text-sm opacity-70">Per month. Unlimited conversions.</div>

                    <ul className="mt-5 space-y-2 text-sm">
                        <li>✅ Unlimited usage across all tools</li>
                        <li>✅ Higher limits (bigger files / more pages)</li>
                        <li>✅ Priority processing (where applicable)</li>
                    </ul>

                    <button
                        type="button"
                        className="mt-6 w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                        onClick={startCheckout}
                        disabled={busy}
                    >
                        {busy ? "Opening Checkout..." : "Upgrade to Pro"}
                    </button>

                    <p className="mt-3 text-xs opacity-70">
                        One Pro subscription unlocks all tools on this account.
                    </p>
                </div>
            </div>

            <div className="mt-10 text-xs opacity-70">
                Questions? Contact support from the footer or email the address listed on the site.
            </div>
        </div>
    );
}
