"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type UsageJson = {
    tool: string;
    freeUsed: boolean;
    freeRemaining: number;
    isPro?: boolean;
};

export default function PricingStatusBanner({ toolId }: { toolId: string }) {
    const sp = useSearchParams();
    const success = sp.get("success") === "1";
    const canceled = sp.get("canceled") === "1";

    const [isPro, setIsPro] = useState<boolean | null>(null);
    const [busyPortal, setBusyPortal] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const bannerMode = useMemo(() => {
        if (success) return "success";
        if (canceled) return "canceled";
        return "none";
    }, [success, canceled]);

    async function fetchProState() {
        try {
            const res = await fetch(`/api/usage/${toolId}`, {
                method: "GET",
                credentials: "include",
                headers: { Accept: "application/json" },
                cache: "no-store",
            });

            if (res.status === 401) {
                setIsPro(false);
                return;
            }

            if (!res.ok) {
                setIsPro(false);
                return;
            }

            const j = (await res.json()) as UsageJson;
            setIsPro(Boolean(j.isPro));
        } catch {
            setIsPro(false);
        }
    }

    // ✅ Auto-refresh when returning from Stripe (success/canceled)
    useEffect(() => {
        if (bannerMode === "none") return;

        // 1) Fetch immediately
        fetchProState();

        // 2) Fetch again after a short delay (webhook may take a moment)
        const t = window.setTimeout(() => {
            fetchProState();
        }, 1500);

        return () => window.clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bannerMode]);

    // Also fetch once on mount (so we can show Manage Billing if already Pro)
    useEffect(() => {
        fetchProState();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function openBillingPortal() {
        setBusyPortal(true);
        setErr(null);

        try {
            const res = await fetch("/api/stripe/portal", {
                method: "POST",
                headers: { Accept: "application/json" },
            });

            if (res.status === 401) {
                window.location.href = `/signin?callbackUrl=${encodeURIComponent("/pricing")}`;
                return;
            }

            const j = await res.json().catch(() => ({} as any));
            if (!res.ok) throw new Error(j?.error || "Unable to open billing portal.");

            if (!j?.url) throw new Error("Portal URL missing.");
            window.location.href = j.url;
        } catch (e: any) {
            setErr(e?.message || "Billing portal failed.");
        } finally {
            setBusyPortal(false);
        }
    }

    // No banner unless returning from Stripe, OR already Pro (so we can show Manage Billing)
    const showSomething = bannerMode !== "none" || isPro === true;

    if (!showSomething) return null;

    const successText =
        isPro === true
            ? "You’re Pro 🎉 Your account is now unlocked."
            : "Payment received ✅ Activating Pro… (this can take a moment)";

    return (
        <div className="mb-5 space-y-3">
            {bannerMode === "success" ? (
                <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-900">
                    <div className="font-semibold">{successText}</div>
                    <div className="mt-1 text-xs text-green-800">
                        If it doesn’t unlock instantly, refresh once — the Stripe webhook may still be syncing.
                    </div>
                </div>
            ) : null}

            {bannerMode === "canceled" ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                    <div className="font-semibold">Checkout canceled</div>
                    <div className="mt-1 text-xs text-amber-800">No worries — you can try again anytime.</div>
                </div>
            ) : null}

            {isPro === true ? (
                <div className="rounded-xl border bg-white p-3">
                    <div className="text-sm font-semibold text-gray-900">Manage your subscription</div>
                    <div className="mt-1 text-xs text-gray-600">
                        Update card, cancel, view invoices, or change billing details.
                    </div>

                    <button
                        onClick={openBillingPortal}
                        disabled={busyPortal}
                        className="mt-3 w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white hover:bg-black disabled:opacity-50"
                    >
                        {busyPortal ? "Opening billing portal..." : "Manage Billing"}
                    </button>

                    {err ? <div className="mt-2 text-sm text-red-600">{err}</div> : null}
                </div>
            ) : null}
        </div>
    );
}
