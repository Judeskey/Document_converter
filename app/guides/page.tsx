import Link from "next/link";

const GUIDES = [
    {
        slug: "pdf-to-word",
        title: "PDF to Word",
        desc: "Convert PDFs to editable Word (DOCX) online.",
        icon: "📄",
        tag: "Popular",
    },
    {
        slug: "ocr-pdf-to-word",
        title: "OCR PDF to Word",
        desc: "Turn scanned PDFs into editable Word using OCR.",
        icon: "🧠",
        tag: "Scanned PDFs",
    },
    {
        slug: "merge-pdf",
        title: "Merge PDF",
        desc: "Combine multiple PDFs into a single file.",
        icon: "🧩",
        tag: "Fast",
    },
    {
        slug: "split-pdf",
        title: "Split PDF",
        desc: "Split PDF by pages, ranges, or extract pages.",
        icon: "✂️",
        tag: "Flexible",
    },
    {
        slug: "compress-pdf",
        title: "Compress PDF",
        desc: "Reduce PDF size without installing software.",
        icon: "📦",
        tag: "Smaller files",
    },
    {
        slug: "pdf-to-image",
        title: "PDF to Image",
        desc: "Convert PDF pages to JPG/PNG images.",
        icon: "🖼️",
        tag: "Export pages",
    },
    {
        slug: "image-converter",
        title: "Image Converter",
        desc: "Convert PNG/JPG/WebP/AVIF online.",
        icon: "✨",
        tag: "Images",
    },
];

export default function GuidesIndexPage() {
    return (
        <main className="mx-auto w-full max-w-6xl px-4 py-10">
            {/* Header */}
            <section className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
                <p className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-700">
                    ✅ Help center • Step-by-step
                </p>

                <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                    Guides
                </h1>

                <p className="mt-3 max-w-3xl text-base leading-7 text-neutral-600">
                    Step-by-step guides to get the best results from DocConvertor tools — no
                    software installation required.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                        href="/tools"
                        className="inline-flex items-center justify-center rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
                    >
                        Browse tools →
                    </Link>

                    <Link
                        href="/pricing"
                        className="inline-flex items-center justify-center rounded-xl border border-neutral-300 bg-white px-5 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
                    >
                        Go Pro
                    </Link>

                    <Link
                        href="/faq"
                        className="inline-flex items-center justify-center rounded-xl border border-neutral-300 bg-white px-5 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
                    >
                        FAQ
                    </Link>
                </div>
            </section>

            {/* Cards */}
            <section className="mt-8">
                <div className="grid gap-4 sm:grid-cols-2">
                    {GUIDES.map((g) => (
                        <Link
                            key={g.slug}
                            href={`/guides/${g.slug}`}
                            className="group rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-md"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50 text-xl">
                                        {g.icon}
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h2 className="text-lg font-semibold text-neutral-900">
                                                {g.title}
                                            </h2>
                                            <span className="rounded-full border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[11px] font-medium text-neutral-700">
                                                {g.tag}
                                            </span>
                                        </div>

                                        <p className="mt-1 text-sm leading-6 text-neutral-600">
                                            {g.desc}
                                        </p>
                                    </div>
                                </div>

                                <span className="mt-1 text-sm font-semibold text-neutral-900 opacity-70 transition group-hover:opacity-100">
                                    Open →
                                </span>
                            </div>

                            <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />

                            <p className="mt-4 text-xs text-neutral-500">
                                Tip: For scanned documents, choose the OCR guide for best results.
                            </p>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="mt-10 rounded-3xl border border-neutral-200 bg-neutral-50 p-8">
                <h3 className="text-lg font-semibold text-neutral-900">
                    Want higher limits + faster workflows?
                </h3>
                <p className="mt-2 text-sm text-neutral-600">
                    Upgrade to Pro to unlock more conversions and a smoother experience.
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                        href="/pricing"
                        className="inline-flex items-center justify-center rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
                    >
                        See pricing →
                    </Link>
                    <Link
                        href="/tools"
                        className="inline-flex items-center justify-center rounded-xl border border-neutral-300 bg-white px-5 py-3 text-sm font-semibold text-neutral-900 hover:bg-white"
                    >
                        Explore tools
                    </Link>
                </div>
            </section>
        </main>
    );
}
