import { Suspense } from "react";
import PricingClient from "./PricingClient";

export const dynamic = "force-dynamic";

export default function Page() {
    return (
        <Suspense
            fallback={
                <div className="mx-auto max-w-5xl p-8">
                    <h1 className="text-3xl font-semibold">Pricing</h1>
                    <p className="mt-2 text-sm opacity-80">Loading…</p>
                </div>
            }
        >
            <PricingClient />
        </Suspense>
    );
}
