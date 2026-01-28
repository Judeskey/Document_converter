import Link from "next/link";

const FooterLink = ({
    href,
    children,
}: {
    href: string;
    children: React.ReactNode;
}) => (
    <Link
        href={href}
        className="text-sm text-neutral-600 hover:text-neutral-900 underline decoration-neutral-200 underline-offset-4 hover:decoration-neutral-400"
    >
        {children}
    </Link>
);

export default function SiteFooter() {
    return (
        <footer className="mt-16 border-t bg-gradient-to-b from-white to-neutral-50">
            <div className="mx-auto max-w-7xl px-4 py-12">
                <div className="grid gap-10 md:grid-cols-4">
                    {/* Brand */}
                    <div>
                        <div className="text-base font-semibold text-neutral-900">
                            DocConvertor
                        </div>
                        <p className="mt-3 text-sm leading-6 text-neutral-600">
                            Fast, secure document tools: merge, split, compress, OCR, and
                            convert files online.
                        </p>
                    </div>

                    {/* Tools */}
                    <div>
                        <div className="text-sm font-semibold text-neutral-900">Tools</div>
                        <div className="mt-4 flex flex-col gap-2">
                            <FooterLink href="/pdf/merge">Merge PDF</FooterLink>
                            <FooterLink href="/pdf/split">Split PDF</FooterLink>
                            <FooterLink href="/pdf/compress">Compress PDF</FooterLink>
                            <FooterLink href="/pdf/to-image">PDF to Image</FooterLink>
                            <FooterLink href="/pdf/to-word">PDF to Word</FooterLink>
                            <FooterLink href="/pdf/ocr-to-word">OCR PDF</FooterLink>
                            <FooterLink href="/image/convert">Image Converter</FooterLink>
                        </div>
                    </div>

                    {/* Popular searches (lightweight) */}
                    <div>
                        <div className="text-sm font-semibold text-neutral-900">
                            Popular
                        </div>
                        <div className="mt-4 flex flex-col gap-2">
                            <FooterLink href="/image/png-to-jpg">PNG to JPG</FooterLink>
                            <FooterLink href="/pdf-to-word/pdf-to-docx">PDF to DOCX</FooterLink>
                            <FooterLink href="/compress/reduce-pdf-size">Reduce PDF Size</FooterLink>
                            <FooterLink href="/pdf-to-image/pdf-to-jpg">PDF to JPG</FooterLink>
                            <FooterLink href="/pdf-ocr-to-word/ocr-pdf-to-word">OCR PDF to Word</FooterLink>
                        </div>
                    </div>

                    {/* Company / Trust */}
                    <div>
                        <div className="text-sm font-semibold text-neutral-900">Company</div>
                        <div className="mt-4 flex flex-col gap-2">
                            <FooterLink href="/pricing">Pricing</FooterLink>
                            <FooterLink href="/faq">FAQ</FooterLink>
                            <FooterLink href="/about">About</FooterLink>
                            <FooterLink href="/privacy">Privacy Policy</FooterLink>
                            <FooterLink href="/terms">Terms of Service</FooterLink>
                        </div>
                    </div>
                </div>

                <div className="mt-10 flex flex-col gap-3 border-t pt-6 text-sm text-neutral-600 md:flex-row md:items-center md:justify-between">
                    <div>© {new Date().getFullYear()} DocConvertor. All rights reserved.</div>
                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                        <FooterLink href="/privacy">Privacy</FooterLink>
                        <FooterLink href="/terms">Terms</FooterLink>
                        <FooterLink href="/faq">FAQ</FooterLink>
                    </div>
                </div>
            </div>
        </footer>
    );
}
