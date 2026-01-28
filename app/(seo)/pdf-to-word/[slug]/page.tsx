import Link from "next/link";
import { notFound } from "next/navigation";
import EmbedPdfToWordTool from "@/components/seo/EmbedPdfToWordTool";

// ---------- SEO DATA (PDF TO WORD) ----------
type SeoPage = {
    slug: string;
    tool: "pdf-to-word";
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

const P2W_PAGES: Record<string, SeoPage> = {
    "pdf-to-word-online": {
        slug: "pdf-to-word-online",
        tool: "pdf-to-word",
        title: "PDF to Word Online Free",
        description:
            "Convert PDF to Word online for free. Turn PDFs into editable DOCX files quickly. Fast, secure, and easy.",
        h1: "PDF to Word Online",
        intro:
            "Convert PDFs into editable Word documents in seconds. Upload your PDF and download the DOCX result.",
        bullets: [
            "Convert PDF to editable Word (DOCX)",
            "Fast and secure conversion",
            "Download instantly after conversion",
            "Works on Windows, Mac, and mobile",
        ],
        faq: [
            {
                q: "Is PDF to Word free to use?",
                a: "Yes. Free users get limited usage per tool. Pro users get unlimited access across all tools.",
            },
            {
                q: "Do failed conversions burn usage?",
                a: "No. Usage is counted only after a successful download.",
            },
            {
                q: "Do you store my PDFs?",
                a: "Files are processed only as needed to complete your request and deliver your download.",
            },
        ],
        primaryCtaHref: "/pdf/to-word",
        primaryCtaText: "Open PDF to Word Tool →",
        secondaryCtaHref: "/pricing",
        secondaryCtaText: "Go Pro",
        canonical: `${SITE_URL}/pdf-to-word/pdf-to-word-online`,
    },

    "pdf-to-docx": {
        slug: "pdf-to-docx",
        tool: "pdf-to-word",
        title: "PDF to DOCX Converter Online",
        description:
            "Convert PDF to DOCX online. Create an editable Word file from your PDF quickly with instant download.",
        h1: "Convert PDF to DOCX",
        intro:
            "Need a DOCX version of a PDF? Convert your PDF into an editable Word document online in minutes.",
        bullets: [
            "Fast PDF to DOCX conversion",
            "Editable output for Word workflows",
            "Simple upload → convert → download",
            "Works on all modern browsers",
        ],
        faq: [
            {
                q: "Will the DOCX be editable?",
                a: "Yes. Most PDFs convert into editable DOCX documents, though exact formatting can vary.",
            },
            {
                q: "Does it work for scanned PDFs?",
                a: "Scanned PDFs usually need OCR. Use our OCR to Word tool for scanned documents.",
            },
            {
                q: "Do failures consume usage?",
                a: "No. Usage counts only after successful download.",
            },
        ],
        primaryCtaHref: "/pdf/to-word",
        primaryCtaText: "Convert PDF to DOCX →",
        secondaryCtaHref: "/pricing",
        secondaryCtaText: "Upgrade to Pro",
        canonical: `${SITE_URL}/pdf-to-word/pdf-to-docx`,
    },

    "convert-pdf-to-word-free": {
        slug: "convert-pdf-to-word-free",
        tool: "pdf-to-word",
        title: "Convert PDF to Word Free",
        description:
            "Convert PDF to Word for free online. Make your PDF editable by converting to DOCX quickly.",
        h1: "Convert PDF to Word Free",
        intro:
            "Convert PDF to Word without installing software. Upload your PDF and download a DOCX result.",
        bullets: [
            "No software installation",
            "Fast conversion",
            "Easy download",
            "Great for quick edits",
        ],
        faq: [
            {
                q: "Do I need an account?",
                a: "No. An account is only required for managing Pro subscription access.",
            },
            {
                q: "Is there a usage limit?",
                a: "Yes for Free users. Pro unlocks unlimited access across all tools.",
            },
            {
                q: "Are files stored permanently?",
                a: "Files are processed only to complete the conversion and deliver results.",
            },
        ],
        primaryCtaHref: "/pdf/to-word",
        primaryCtaText: "Convert Free →",
        secondaryCtaHref: "/pricing",
        secondaryCtaText: "Go Pro",
        canonical: `${SITE_URL}/pdf-to-word/convert-pdf-to-word-free`,
    },

    "pdf-to-word-for-mac": {
        slug: "pdf-to-word-for-mac",
        tool: "pdf-to-word",
        title: "PDF to Word on Mac (Online)",
        description:
            "Convert PDF to Word on Mac online. No installation needed—create DOCX files in your browser.",
        h1: "PDF to Word on Mac",
        intro:
            "Convert PDFs to editable Word docs on macOS. Works on Safari/Chrome with a simple workflow.",
        bullets: [
            "Works on macOS",
            "No installation required",
            "Fast conversion and download",
            "Great for editing in Word/Pages",
        ],
        faq: [
            {
                q: "Does it work on Safari?",
                a: "Yes, though Chrome can provide the smoothest experience for large files.",
            },
            {
                q: "Will formatting stay the same?",
                a: "Formatting usually transfers well, but complex PDFs may require minor edits.",
            },
            {
                q: "Do failed jobs burn usage?",
                a: "No. Usage counts only after successful download.",
            },
        ],
        primaryCtaHref: "/pdf/to-word",
        primaryCtaText: "Convert on Mac →",
        secondaryCtaHref: "/pricing",
        secondaryCtaText: "Upgrade to Pro",
        canonical: `${SITE_URL}/pdf-to-word/pdf-to-word-for-mac`,
    },

    "pdf-to-word-for-windows": {
        slug: "pdf-to-word-for-windows",
        tool: "pdf-to-word",
        title: "PDF to Word on Windows (Online)",
        description:
            "Convert PDF to Word on Windows online. Turn PDFs into editable DOCX files quickly.",
        h1: "PDF to Word on Windows",
        intro:
            "Convert PDFs into Word on Windows without installing software. Upload, convert, and download your DOCX.",
        bullets: [
            "Works on Windows 10/11",
            "Best on Chrome/Edge",
            "Fast DOCX output",
            "Instant download after conversion",
        ],
        faq: [
            {
                q: "Does it work with Microsoft Edge?",
                a: "Yes. Edge works well for PDF to Word conversions.",
            },
            {
                q: "Do I need to sign in?",
                a: "No. Sign-in is optional for free usage. Pro requires an account to manage subscription access.",
            },
            {
                q: "Do failed conversions burn usage?",
                a: "No. Usage counts only after successful download.",
            },
        ],
        primaryCtaHref: "/pdf/to-word",
        primaryCtaText: "Convert on Windows →",
        secondaryCtaHref: "/pricing",
        secondaryCtaText: "Go Pro",
        canonical: `${SITE_URL}/pdf-to-word/pdf-to-word-for-windows`,
    },
};

// ---------- Metadata ----------
export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const page = P2W_PAGES[slug];
    if (!page) return {};

    return {
        title: page.title,
        description: page.description,
        alternates: {
            canonical: page.canonical || `${SITE_URL}/pdf-to-word/${page.slug}`,
        },
        openGraph: {
            title: page.title,
            description: page.description,
            url: page.canonical || `${SITE_URL}/pdf-to-word/${page.slug}`,
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
export default async function ProgrammaticPdfToWordSeoPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const page = P2W_PAGES[slug];
    if (!page) return notFound();

    return (
        <main className="min-h-screen bg-gradient-to-b from-white via-white to-neutral-50">
            <section className="border-b bg-gradient-to-r from-fuchsia-50 via-white to-cyan-50">
                <div className="mx-auto max-w-5xl px-4 py-10">
                    <div className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs text-neutral-700 shadow-sm">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        Tool • PDF to Word
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
                    <EmbedPdfToWordTool />
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
                        <Link className="underline" href="/pdf/to-word">
                            Open PDF to Word Tool
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
    return Object.keys(P2W_PAGES).map((slug) => ({ slug }));
}
