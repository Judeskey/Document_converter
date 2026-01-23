import GoProButton from "@/components/GoProButton";

export default function PricingPage() {
    return (
        <main className="mx-auto max-w-2xl p-6">
            <h1 className="text-3xl font-bold">DocConvertor Pro</h1>
            <p className="mt-2 text-gray-600">
                Unlimited conversions for $9.99 CAD/month.
            </p>

            <div className="mt-6 rounded-xl border p-5">
                <ul className="list-disc pl-5 text-gray-700">
                    <li>Unlimited conversions</li>
                    <li>No daily limits</li>
                    <li>Priority processing</li>
                </ul>

                <div className="mt-5">
                    <GoProButton />
                </div>
            </div>
        </main>
    );
}
