import Link from "next/link";
import { notFound } from "next/navigation";
import EmbedPdfOcrToWordTool from "@/components/seo/EmbedPdfOcrToWordTool";

// ---------- SEO DATA (PDF OCR TO WORD) ----------
type SeoPage = {
    slug: string;
    tool: "pdf-ocr-to-word";
    title: string;
    description: string;
    h1: string;
    intro: string;
    bullets: string[];
    faq: { q: string; a: string }[];
    primaryCtaHref: string;
    primaryCtaText: string;
    secondaryCtaHref?: string;
    secondaryCtaText?: string;
    canonical?: string;
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://docconvertor.com";

const OCR_PAGES: Record<string, SeoPage> = {
    "ocr-pdf-to-word": {
        slug: "ocr-pdf-to-word",
        tool: "pdf-ocr-to-word",
        title: "OCR PDF to Word Online",
        description:
            "Convert scanned PDFs to editable Word using OCR. Extract text accurately and download a DOCX file. Fast and secure.",
        h1: "OCR PDF to Word",
        intro:
            "Have a scanned PDF? Use OCR to extract text and convert it into an editable Word document in minutes.",
        bullets: [
            "Convert scanned PDFs into editable Word (DOCX)",
            "OCR text extraction for image-based PDFs",
            "Download after conversion",
            "Works on Windows, Mac, and mobile",
        ],
        faq: [
            {
                q: "What is OCR PDF to Word?",
                a: "OCR reads text from scanned or image-based PDFs and converts it into an editable Word document.",
            },
            {
                q: "Will failed conversions burn usage?",
                a: "No. Usage is counted only after a successful download.",
            },
            {
                q: "Do you store my files?",
                a: "Files are processed only as needed to complete OCR and deliver your download.",
            },
        ],
        primaryCtaHref: "/pdf/ocr-to-word",
        primaryCtaText: "Open OCR to Word Tool →",
        secondaryCtaHref: "/pricing",
        secondaryCtaText: "Go Pro",
        canonical: `${SITE_URL}/pdf-ocr-to-word/ocr-pdf-to-word`,
    },

    "scan-pdf-to-word": {
        slug: "scan-pdf-to-word",
        tool: "pdf-ocr-to-word",
        title: "Convert Scanned PDF to Word",
        description:
            "Convert scanned PDF to Word online using OCR. Turn scanned documents into editable DOCX quickly.",
        h1: "Convert Scanned PDF to Word",
        intro:
            "Turn scanned PDFs into editable Word files. Upload, run OCR, and download your DOCX.",
        bullets: [
            "Best for scanned documents",
            "Extract text using OCR",
            "Editable DOCX output",
            "Fast and secure workflow",
        ],
        faq: [
            {
                q: "Does OCR work for all scans?",
                a: "OCR accuracy depends on scan quality, resolution, and clarity. Clean scans usually produce the best results.",
            },
            {
                q: "Can I use this for handwriting?",
                a: "Handwriting OCR results vary a lot. Printed text typically produces better accuracy.",
            },
            {
                q: "Do failures consume usage?",
                a: "No. Usage counts only after successful download.",
            },
        ],
        primaryCtaHref: "/pdf/ocr-to-word",
        primaryCtaText: "Convert Scanned PDF →",
        secondaryCtaHref: "/pricing",
        secondaryCtaText: "Upgrade to Pro",
        canonical: `${SITE_URL}/pdf-ocr-to-word/scan-pdf-to-word`,
    },

    "pdf-ocr-to-docx": {
        slug: "pdf-ocr-to-docx",
        tool: "pdf-ocr-to-word",
        title: "PDF OCR to DOCX Converter",
        description:
            "Convert PDF to DOCX with OCR. Extract text from scanned PDFs and create an editable Word file.",
        h1: "PDF OCR to DOCX",
        intro:
            "Need an editable DOCX from a scanned PDF? Use OCR to extract text and convert to Word.",
        bullets: [
            "OCR extraction + DOCX output",
            "Great for scanned PDFs",
            "Simple upload and download",
            "Works on any modern device",
        ],
        faq: [
            {
                q: "Is the output editable?",
                a: "Yes. The DOCX output is intended to be editable, though formatting can vary by document type.",
            },
            {
                q: "Does it preserve layout?",
                a: "OCR focuses on text extraction. Layout preservation may vary depending on the original PDF.",
            },
            {
                q: "Do failed jobs burn usage?",
                a: "No. Usage only counts after successful download.",
            },
        ],
        primaryCtaHref: "/pdf/ocr-to-word",
        primaryCtaText: "OCR to DOCX →",
        secondaryCtaHref: "/pricing",
        secondaryCtaText: "Go Pro",
        canonical: `${SITE_URL}/pdf-ocr-to-word/pdf-ocr-to-docx`,
    },

    "convert-scanned-pdf-to-word": {
        slug: "convert-scanned-pdf-to-word",
        tool: "pdf-ocr-to-word",
        title: "Convert Scanned PDF to Word Online",
        description:
            "Convert scanned PDFs to Word online with OCR. Extract text and download an editable DOCX file quickly.",
        h1: "Convert Scanned PDF to Word Online",
        intro:
            "Upload your scanned PDF, run OCR, and download an editable Word document. Great for forms and scanned pages.",
        bullets: [
            "OCR for scanned PDFs",
            "Editable Word output",
            "Fast conversion",
            "Download instantly after completion",
        ],
        faq: [
            {
                q: "Is this different from normal PDF to Word?",
                a: "Yes. Normal PDF to Word is best for text PDFs. OCR to Word is best for scanned/image-based PDFs.",
            },
            {
                q: "How accurate is OCR?",
                a: "OCR accuracy depends on scan quality. Higher resolution and clear text improve results.",
            },
            {
                q: "Are files stored permanently?",
                a: "Files are processed only to complete conversion and deliver your result.",
            },
        ],
        primaryCtaHref: "/pdf/ocr-to-word",
        primaryCtaText: "Convert Scanned PDF →",
        secondaryCtaHref: "/pricing",
        secondaryCtaText: "Upgrade to Pro",
        canonical: `${SITE_URL}/pdf-ocr-to-word/convert-scanned-pdf-to-word`,
    },

    "extract-text-from-scanned-pdf": {
        slug: "extract-text-from-scanned-pdf",
        tool: "pdf-ocr-to-word",
        title: "Extract Text from Scanned PDF",
        description:
            "Extract text from scanned PDFs using OCR. Convert to Word for editing and reuse. Fast and secure.",
        h1: "Extract Text from Scanned PDF",
        intro:
            "Need the text inside a scanned document? Use OCR to extract text and export it to Word for editing.",
        bullets: [
            "Extract text from scanned PDFs",
            "Useful for editing and copying text",
            "Works on mobile and desktop",
            "Secure processing and download",
        ],
        faq: [
            {
                q: "Can OCR extract text from photos?",
                a: "OCR is designed for image-based content. Results depend on clarity and lighting.",
            },
            {
                q: "Can I copy text after conversion?",
                a: "Yes. The Word output is editable and text can be copied.",
            },
            {
                q: "Do failures count against usage?",
                a: "No. Usage only counts after successful download.",
            },
        ],
        primaryCtaHref: "/pdf/ocr-to-word",
        primaryCtaText: "Extract Text with OCR →",
        secondaryCtaHref: "/pricing",
        secondaryCtaText: "Go Pro",
        canonical: `${SITE_URL}/pdf-ocr-to-word/extract-text-from-scanned-pdf`,
    },
};

// ---------- Metadata ----------
export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const page = OCR_PAGES[slug];
    if (!page) return {};

    return {
        title: page.title,
        description: page.description,
        alternates: {
            canonical: page.canonical || `${SITE_URL}/pdf-ocr-to-word/${page.slug}`,
        },
        openGraph: {
            title: page.title,
            description: page.description,
            url: page.canonical || `${SITE_URL}/pdf-ocr-to-word/${page.slug}`,
            siteName: "DocConvertor",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: page.title,
            description: page.description,
        },
    };
}

// ---------- Page ----------
export default async function ProgrammaticPdfOcrToWordSeoPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const page = OCR_PAGES[slug];
    if (!page) return notFound();

    return (
        <main className="min-h-screen bg-gradient-to-b from-white via-white to-neutral-50">
            <section className="border-b bg-gradient-to-r from-fuchsia-50 via-white to-cyan-50">
                <div className="mx-auto max-w-5xl px-4 py-10">
                    <div className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs text-neutral-700 shadow-sm">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        Tool • OCR PDF to Word
                    </div>

                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
                        {page.h1}
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">
                        {page.intro}
                    </p>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <Link
                            href={page.primaryCtaHref}
                            className="inline-flex items-center justify-center rounded-full bg-black px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
                        >
                            {page.primaryCtaText}
                        </Link>

                        {page.secondaryCtaHref && page.secondaryCtaText ? (
                            <Link
                                href={page.secondaryCtaHref}
                                className="inline-flex items-center justify-center rounded-full border bg-white px-5 py-2 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
                            >
                                {page.secondaryCtaText}
                            </Link>
                        ) : null}
                    </div>

                    <ul className="mt-6 grid gap-2 text-sm text-neutral-700 sm:grid-cols-2">
                        {page.bullets.map((b) => (
                            <li
                                key={b}
                                className="flex items-start gap-2 rounded-xl border bg-white px-3 py-2"
                            >
                                <span className="mt-0.5 text-neutral-400">•</span>
                                <span>{b}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <section className="mx-auto max-w-5xl px-4 py-10">
                <div className="rounded-2xl border bg-white p-4 shadow-sm sm:p-6">
                    <EmbedPdfOcrToWordTool />
                </div>

                <div className="mt-10 rounded-2xl border bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-neutral-900">FAQ</h2>
                    <div className="mt-4 space-y-4">
                        {page.faq.map((f) => (
                            <div
                                key={f.q}
                                className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4"
                            >
                                <div className="text-sm font-semibold text-neutral-900">{f.q}</div>
                                <div className="mt-1 text-sm leading-6 text-neutral-600">{f.a}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-10 text-sm text-neutral-600">
                    Related:
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
                        <Link className="underline" href="/pdf/ocr-to-word">
                            Open OCR to Word Tool
                        </Link>
                        <Link className="underline" href="/pricing">
                            Pricing
                        </Link>
                        <Link className="underline" href="/privacy">
                            Privacy
                        </Link>
                        <Link className="underline" href="/faq">
                            FAQ
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}

// ---------- Static generation ----------
export function generateStaticParams() {
    return Object.keys(OCR_PAGES).map((slug) => ({ slug }));
}
