import { Suspense } from "react";
import BillingSuccessClient from "./BillingSuccessClient";

export const dynamic = "force-dynamic";

export default function Page() {
    return (
        <Suspense
            fallback={
                <div className="mx-auto max-w-xl p-8">
                    <h1 className="text-2xl font-semibold">Payment success</h1>
                    <p className="mt-3 text-sm opacity-80">
                        Finalizing your subscription...
                    </p>
                </div>
            }
        >
            <BillingSuccessClient />
        </Suspense>
    );
}
