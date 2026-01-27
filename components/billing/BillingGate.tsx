"use client";

import React from "react";

export default function BillingGate({
    billingLoaded,
    isPro,
    freeRemaining,
    children,
    upgradeCard,
    loadingFallback,
}: {
    billingLoaded: boolean;
    isPro: boolean;
    freeRemaining: number;
    children: React.ReactNode;
    upgradeCard: React.ReactNode;
    loadingFallback?: React.ReactNode;
}) {
    // 1) While checking subscription, don’t show FREE gating UI yet
    if (!billingLoaded) {
        return (
            loadingFallback ?? (
                <div className="rounded-xl border p-4 text-sm opacity-80">
                    Checking subscription…
                </div>
            )
        );
    }

    // 2) PRO users: always allow, never show upgrade
    if (isPro) {
        return <>{children}</>;
    }

    // 3) FREE users: apply normal gating
    if (freeRemaining <= 0) {
        return <>{upgradeCard}</>;
    }

    return <>{children}</>;
}
