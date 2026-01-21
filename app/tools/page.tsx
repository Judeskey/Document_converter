"use client";

import Link from "next/link";

type Tool = {
    title: string;
    desc: string;
    href: string;
    badge: string; // small pill label
    gradient: string; // tailwind gradient classes
    icon: string; // emoji icon (simple + reliable)
};

const TOOLS: Tool[] = [
    {
        title: "Image Converter",
        desc: "PNG / JPG / WebP / AVIF",
        href: "/image/convert",
        badge: "Fast",
        gradient: "from-fuchsia-500 to-pink-500",
        icon: "🖼️",
    },
    {
        title: "PDF Merge",
        desc: "Upload, reorder, merge, download",
        href: "/pdf/merge",
        badge: "Popular",
        gradient: "from-blue-500 to-cyan-500",
        icon: "🧩",
    },
    {
        title: "PDF Split",
        desc: "Split by page, range, or parts",
        href: "/pdf/split",
        badge: "Flexible",
        gradient: "from-emerald-500 to-teal-500",
        icon: "✂️",
    },
    {
        title: "PDF → Image",
        desc: "Convert first page or all pages (ZIP)",
        href: "/pdf/to-image",
        badge: "High value",
        gradient: "from-indigo-500 to-violet-500",
        icon: "🧾",
    },
    {
        title: "Compress PDF",
        desc: "Reduce PDF size for uploads",
        href: "/pdf/compress",
        badge: "New",
        gradient: "from-orange-500 to-amber-500",
        icon: "🗜️",
    },
    {
        title: "PDF → Word",
        desc: "Headings, lists, page breaks, basic tables",
        href: "/pdf/to-doc",
        badge: "Improved",
        gradient: "from-sky-500 to-blue-600",
        icon: "📄",
    },
    {
        title: "OCR (Scanned PDF)",
        desc: "Turn scanned PDFs into editable Word (DOCX)",
        href: "/pdf/ocr",
        badge: "Pro",
        gradient: "from-rose-500 to-red-500",
        icon: "🔎",
    },
];

export default function ToolsPage() {
    return (
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
            {/* Top bar */}
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight">All Tools</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Free online document and image tools. Fast, secure, and free-to-try.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold
                       hover:bg-gray-50"
                    >
                        ← Home
                    </Link>
                    <Link
                        href="/"
                        className="hidden sm:inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold
                       bg-gray-900 text-white hover:bg-black"
                    >
                        Start converting →
                    </Link>
                </div>
            </div>

            {/* Hero card */}
            <div className="mt-6 rounded-2xl border bg-gradient-to-br from-gray-50 to-white p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold border">
                            ✅ MVP tools ready
                        </div>
                        <h2 className="mt-3 text-xl font-bold">
                            Convert, merge, split, compress, OCR — in one place.
                        </h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Built feature-first. Payment comes later (free-to-try with a natural upgrade path).
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <a
                            href="#tools"
                            className="rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black"
                        >
                            Browse tools
                        </a>
                        <Link
                            href="/"
                            className="rounded-full border px-4 py-2 text-sm font-semibold hover:bg-gray-50"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div id="tools" className="mt-8 grid gap-4 sm:grid-cols-2">
                {TOOLS.map((t) => (
                    <Link
                        key={t.href}
                        href={t.href}
                        className="group relative overflow-hidden rounded-2xl border bg-white p-5
                       transition hover:-translate-y-0.5 hover:shadow-lg"
                    >
                        {/* Decorative gradient blob */}
                        <div
                            className={[
                                "absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-20 blur-2xl",
                                "bg-gradient-to-br",
                                t.gradient,
                            ].join(" ")}
                        />

                        <div className="relative flex items-start gap-4">
                            {/* Icon badge */}
                            <div
                                className={[
                                    "flex h-12 w-12 items-center justify-center rounded-2xl text-xl",
                                    "bg-gradient-to-br text-white shadow-sm",
                                    t.gradient,
                                ].join(" ")}
                            >
                                {t.icon}
                            </div>

                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <h2 className="truncate text-base font-bold">{t.title}</h2>
                                    <span className="rounded-full border bg-gray-50 px-2 py-0.5 text-xs font-semibold text-gray-700">
                                        {t.badge}
                                    </span>
                                </div>

                                <p className="mt-1 text-sm text-gray-600">{t.desc}</p>

                                <div className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-gray-900">
                                    Open tool
                                    <span className="transition group-hover:translate-x-0.5">→</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Footer note */}
            <div className="mt-10 rounded-2xl border bg-gray-50 p-5 text-sm text-gray-700">
                <div className="font-semibold">Tip</div>
                <div className="mt-1">
                    If a PDF looks scanned (no selectable text), use{" "}
                    <Link href="/pdf/ocr" className="underline font-semibold">
                        OCR (Scanned PDF)
                    </Link>{" "}
                    for best results.
                </div>
            </div>
        </div>
    );
}
