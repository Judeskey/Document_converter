import Link from "next/link";

export default function SiteFooter() {
    return (
        <footer className="border-t bg-white">
            <div className="mx-auto max-w-6xl px-4 py-14">
                {/* Top section */}
                <div className="grid gap-10 lg:grid-cols-2">
                    {/* Brand + trust */}
                    <div>
                        <div className="flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 text-white font-bold">
                                D
                            </div>
                            <span className="text-sm font-semibold text-gray-900">
                                DocConvertor
                            </span>
                        </div>

                        <p className="mt-4 max-w-md text-sm text-gray-600">
                            Fast, secure document tools — merge, split, compress, OCR, and
                            convert files online.
                        </p>

                        <p className="mt-3 max-w-md text-sm text-gray-600">
                            No software installation required. Files are processed securely to
                            complete your request and are not kept permanently.
                        </p>

                        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                            <div className="rounded-xl border px-4 py-3">
                                <div className="font-semibold text-gray-900">No installs</div>
                                <div className="text-gray-600">Runs in your browser</div>
                            </div>
                            <div className="rounded-xl border px-4 py-3">
                                <div className="font-semibold text-gray-900">Secure</div>
                                <div className="text-gray-600">Privacy-first processing</div>
                            </div>
                            <div className="rounded-xl border px-4 py-3">
                                <div className="font-semibold text-gray-900">Fast results</div>
                                <div className="text-gray-600">Optimized workflow</div>
                            </div>
                            <div className="rounded-xl border px-4 py-3">
                                <div className="font-semibold text-gray-900">Everywhere</div>
                                <div className="text-gray-600">Desktop & mobile</div>
                            </div>
                        </div>
                    </div>

                    {/* Conversion block */}
                    <div className="rounded-3xl border bg-gray-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Get more done in less time
                        </h3>

                        <p className="mt-2 text-sm text-gray-600">
                            Upgrade to Pro for unlimited usage across all document and image
                            tools.
                        </p>

                        <div className="mt-5 flex flex-wrap gap-3">
                            <Link
                                href="/pricing"
                                className="rounded-full bg-black px-6 py-2.5 text-sm font-semibold text-white hover:bg-gray-900"
                            >
                                Go Pro →
                            </Link>

                            <Link
                                href="/tools"
                                className="rounded-full border px-6 py-2.5 text-sm font-semibold hover:bg-white"
                            >
                                Browse tools
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Links */}
                <div className="mt-14 grid gap-8 sm:grid-cols-2 md:grid-cols-4 text-sm">
                    <div>
                        <div className="font-semibold text-gray-900">Tools</div>
                        <ul className="mt-3 space-y-2 text-gray-600">
                            <li><Link href="/tools">All tools</Link></li>
                            <li><Link href="/pdf/merge">Merge PDF</Link></li>
                            <li><Link href="/pdf/split">Split PDF</Link></li>
                            <li><Link href="/pdf/compress">Compress PDF</Link></li>
                            <li><Link href="/pdf/to-word">PDF to Word</Link></li>
                        </ul>
                    </div>

                    <div>
                        <div className="font-semibold text-gray-900">Guides</div>
                        <ul className="mt-3 space-y-2 text-gray-600">
                            <li><Link href="/guides">All guides</Link></li>
                            <li><Link href="/guides/pdf-to-word">PDF to Word guide</Link></li>
                            <li><Link href="/guides/ocr-pdf-to-word">OCR PDF guide</Link></li>
                            <li><Link href="/guides/merge-pdf">Merge PDF guide</Link></li>
                            <li><Link href="/guides/split-pdf">Split PDF guide</Link></li>
                        </ul>
                    </div>

                    <div>
                        <div className="font-semibold text-gray-900">Popular</div>
                        <ul className="mt-3 space-y-2 text-gray-600">
                            <li><Link href="/image/png-to-jpg">PNG to JPG</Link></li>
                            <li><Link href="/pdf-to-word/pdf-to-docx">PDF to DOCX</Link></li>
                            <li><Link href="/compress/reduce-pdf-size">Reduce PDF size</Link></li>
                            <li><Link href="/split/extract-pages-from-pdf">Extract pages</Link></li>
                        </ul>
                    </div>

                    <div>
                        <div className="font-semibold text-gray-900">Company</div>
                        <ul className="mt-3 space-y-2 text-gray-600">
                            <li><Link href="/pricing">Pricing</Link></li>
                            <li><Link href="/faq">FAQ</Link></li>
                            <li><Link href="/about">About</Link></li>
                            <li><Link href="/privacy">Privacy Policy</Link></li>
                            <li><Link href="/terms">Terms</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-10 border-t pt-6 text-xs text-gray-500 flex flex-col sm:flex-row justify-between gap-3">
                    <div>
                        © {new Date().getFullYear()} DocConvertor. All rights reserved.
                    </div>
                    <div>
                        Built for speed • Privacy-first • No installations
                    </div>
                </div>
            </div>
        </footer>
    );
}
