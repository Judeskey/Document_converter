import Link from "next/link";

export default function BillingCancelPage() {
    return (
        <div className="mx-auto max-w-xl p-6">
            <h1 className="text-2xl font-semibold">Checkout canceled</h1>
            <p className="mt-3">No worries — you can upgrade anytime.</p>

            <div className="mt-6">
                <Link className="rounded-md bg-black px-4 py-2 text-white" href="/">
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
