import Link from "next/link";
import TrustNotice from "@/components/TrustNotice";

type Props = {
    title: string;
    description?: string;
};

export default function ToolPageHeader({ title, description }: Props) {
    return (
        <header className="mb-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                        {title}
                    </h1>

                    {description ? (
                        <p className="mt-2 text-sm text-gray-600 sm:text-base">
                            {description}
                        </p>
                    ) : null}

                    {/* Global trust message (shows on every tool page that uses ToolPageHeader) */}
                    <TrustNotice />
                </div>

                <div className="flex items-center gap-2">
                    <Link
                        href="/tools"
                        className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-100"
                    >
                        All tools
                    </Link>

                    <Link
                        href="/"
                        className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-100"
                    >
                        Home
                    </Link>
                </div>
            </div>

            <div className="mt-5 h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        </header>
    );
}
