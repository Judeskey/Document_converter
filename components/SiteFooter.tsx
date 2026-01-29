import Link from "next/link";

const YEAR = new Date().getFullYear();

const BADGES = [
    { label: "No installs", sub: "Runs in browser" },
    { label: "Secure processing", sub: "Privacy-first" },
    { label: "Fast results", sub: "Optimized workflow" },
    { label: "Works everywhere", sub: "Mobile + desktop" },
];

const TOOL_LINKS = [
    { href: "/tools", label: "All tools" },
    { href: "/pdf/merge", label: "Merge PDF" },
    { href: "/pdf/split", label: "Split PDF" },
    { href: "/pdf/compress", label: "Compress PDF" },
    { href: "/pdf/to-word", label: "PDF to Word" },
    { href: "/pdf/ocr-to-word", label: "OCR PDF to Word" },
    { href: "/pdf/to-image", label: "PDF to Image" },
    { href: "/image/convert", label: "Image Converter" },
];

const GUIDES = [
    { href: "/guides", label: "All guides" },
    { href: "/guides/pdf-to-word", label: "PDF to Word guide" },
    { href: "/guides/ocr-pdf-to-word", label: "OCR PDF to Word guide" },
    { href: "/guides/merge-pdf", label: "Merge PDF guide" },
    { href: "/guides/split-pdf", label: "Split PDF guide" },
];

const POPULAR = [
    { href: "/image/png-to-jpg", label: "PNG to JPG" },
    { href: "/pdf-to-word/pdf-to-docx", label: "PDF to DOCX" },
    { href: "/compress/reduce-pdf-size", label: "Reduce PDF size" },
    { href: "/split/extract-pages-from-pdf", label: "Extract PDF pages" },
];

const COMPANY = [
    { href: "/pricing", label: "Pricing" },
    { href: "/faq", label: "FAQ" },
    { href: "/about", label: "About" },
    { href: "/privacy", label: "Privacy policy" },
    { href: "/terms", label: "Terms" },
];

function FooterLink({ href, label }: { href: string; label: string }) {
    return (
        <Link
            href={href}
            className="text-sm text-neutral-600 hover:text-neutral-900 hover:underline underline-offset-4"
        >
            {label}
        </Link>
    );
}

export default function SiteFooter() {
    return (
        <footer className="relative mt-16 border-t border-neutral-200 bg-white">
            {/* Soft gradient top accent */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-neutral-50 to-transparent" />

            <div className="mx-auto max-w-6xl px-4 py-12">
                {/* Top: Brand + CTA */}
                <div className="grid gap-8 lg:grid-cols-12">
                    <div className="lg:col-span-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50 shadow-sm">
                                {/* Simple “spark” icon */}
                                <span className="text-lg">✨</span>
                            </div>

                            <div>
                                <div className="text-base font-semibold tracking-tight text-neutral-900">
                                    DocConvertor
                                </div>
                                <div className="text-sm text-neutral-600">
                                    Fast, secure document tools — merge, split, compress, OCR, and convert.
                                </div>
                            </div>
                        </div>

                        <p className="mt-4 text-sm leading-6 text-neutral-600">
                            No software installation required. Your files are processed securely to complete your request
                            and are not kept permanently.
                        </p>

                        {/* Trust badges */}
                        <div className="mt-6 grid gap-3 sm:grid-cols-2">
                            {BADGES.map((b) => (
                                <div
                                    key={b.label}
                                    className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4"
                                >
                                    <div className="text-sm font-semibold text-neutral-900">{b.label}</div>
                                    <div className="mt-1 text-xs text-neutral-600">{b.sub}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-7">
                        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <div className="text-sm font-semibold text-neutral-900">
                                        Get more done in less time
                                    </div>
                                    <div className="mt-1 text-sm text-neutral-600">
                                        Try Pro for unlimited productivity across all tools.
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    <Link
                                        href="/pricing"
                                        className="inline-flex items-center justify-center rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
                                    >
                                        Go Pro →
                                    </Link>
                                    <Link
                                        href="/tools"
                                        className="inline-flex items-center justify-center rounded-xl border border-neutral-300 bg-white px-5 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
                                    >
                                        Browse tools
                                    </Link>
                                </div>
                            </div>

                            {/* “Newsletter” (optional, non-functional placeholder) */}
                            <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                                <div className="text-sm font-semibold text-neutral-900">
                                    Product updates (optional)
                                </div>
                                <div className="mt-1 text-sm text-neutral-600">
                                    If you ever add email capture later, this spot is ready.
                                </div>

                                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                                    <input
                                        disabled
                                        placeholder="Email (coming soon)"
                                        className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-500 shadow-sm outline-none"
                                    />
                                    <button
                                        disabled
                                        className="rounded-xl border border-neutral-200 bg-white px-5 py-3 text-sm font-semibold text-neutral-400"
                                    >
                                        Subscribe
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="my-10 h-px w-full bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />

                {/* Link columns */}
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-12">
                    <div className="lg:col-span-3">
                        <div className="text-sm font-semibold text-neutral-900">Tools</div>
                        <div className="mt-4 grid gap-2">
                            {TOOL_LINKS.map((l) => (
                                <FooterLink key={l.href} href={l.href} label={l.label} />
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-3">
                        <div className="text-sm font-semibold text-neutral-900">Guides</div>
                        <div className="mt-4 grid gap-2">
                            {GUIDES.map((l) => (
                                <FooterLink key={l.href} href={l.href} label={l.label} />
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-3">
                        <div className="text-sm font-semibold text-neutral-900">Popular</div>
                        <div className="mt-4 grid gap-2">
                            {POPULAR.map((l) => (
                                <FooterLink key={l.href} href={l.href} label={l.label} />
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-3">
                        <div className="text-sm font-semibold text-neutral-900">Company</div>
                        <div className="mt-4 grid gap-2">
                            {COMPANY.map((l) => (
                                <FooterLink key={l.href} href={l.href} label={l.label} />
                            ))}
                        </div>

                        {/* “Mini status” */}
                        <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                            <div className="text-xs font-semibold text-neutral-900">Always improving</div>
                            <div className="mt-1 text-xs leading-5 text-neutral-600">
                                New tools + guides added regularly to boost your productivity.
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-10 flex flex-col gap-4 border-t border-neutral-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-xs text-neutral-600">
                        © {YEAR} DocConvertor. All rights reserved.
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Link
                            href="/privacy"
                            className="text-xs text-neutral-600 hover:text-neutral-900 hover:underline underline-offset-4"
                        >
                            Privacy
                        </Link>
                        <span className="text-neutral-300">•</span>
                        <Link
                            href="/terms"
                            className="text-xs text-neutral-600 hover:text-neutral-900 hover:underline underline-offset-4"
                        >
                            Terms
                        </Link>
                        <span className="text-neutral-300">•</span>
                        <Link
                            href="/faq"
                            className="text-xs text-neutral-600 hover:text-neutral-900 hover:underline underline-offset-4"
                        >
                            Help
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
