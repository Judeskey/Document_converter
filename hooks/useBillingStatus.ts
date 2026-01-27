"use client";

import { useEffect, useState } from "react";
import { isProUser, BillingUser } from "@/lib/billing-client";

type BillingState = {
    billingLoaded: boolean;
    isPro: boolean;
    user: BillingUser | null;
    error?: string | null;
};

export function useBillingStatus(): BillingState {
    const [billingLoaded, setBillingLoaded] = useState(false);
    const [isPro, setIsPro] = useState(false);
    const [user, setUser] = useState<BillingUser | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let alive = true;

        (async () => {
            try {
                const res = await fetch("/api/billing/me", { cache: "no-store" });
                const data = await res.json().catch(() => null);

                if (!alive) return;

                if (res.ok && data?.ok && data?.user) {
                    setUser(data.user);
                    setIsPro(isProUser(data.user));
                    setError(null);
                } else {
                    setUser(null);
                    setIsPro(false);
                    setError(data?.error || "BILLING_ME_FAILED");
                }
            } catch {
                if (!alive) return;
                setUser(null);
                setIsPro(false);
                setError("BILLING_ME_EXCEPTION");
            } finally {
                if (alive) setBillingLoaded(true); // ✅ now billingLoaded is meaningful
            }
        })();

        return () => {
            alive = false;
        };
    }, []);

    return { billingLoaded, isPro, user, error };
}
