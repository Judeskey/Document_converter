import Link from "next/link";

export default function ToolPageHeader({
    title,
    description,
}: {
    title: string;
    description?: string;
}) {
    return (
        <header className="mb-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">{title}</h1>
                    {description ? (
                        <p className="mt-2 text-sm sm:text-base text-gray-600">{description}</p>
                    ) : null}
                </div>

                <div className="flex items-center gap-2">
                    <Link
                        href="/tools"
                        className="inline-flex items-center rounded-full px-3 py-1.5 text-sm font-semibold
                       bg-indigo-50 text-indigo-700 border border-indigo-200
                       hover:bg-indigo-100"
                    >
                        All tools
                    </Link>

                    <Link
                        href="/"
                        className="inline-flex items-center rounded-full px-3 py-1.5 text-sm font-semibold
                       bg-emerald-50 text-emerald-700 border border-emerald-200
                       hover:bg-emerald-100"
                    >
                        Home
                    </Link>
                </div>
            </div>

            <div className="mt-5 h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        </header>
    );
}
