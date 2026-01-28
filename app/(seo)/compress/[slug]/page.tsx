import Link from "next/link";
import { notFound } from "next/navigation";
import EmbedPdfCompressTool from "@/components/seo/EmbedPdfCompressTool";

// ---------- SEO DATA (COMPRESS PDF) ----------
type SeoPage = {
    slug: string;
    tool: "compress-pdf";
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

const COMPRESS_PAGES: Record<string, SeoPage> = {
    "compress-pdf-online": {
        slug: "compress-pdf-online",
        tool: "compress-pdf",
        title: "Compress PDF Online Free",
        description:
            "Compress PDF online for free. Reduce PDF file size quickly while keeping quality. Fast and secure.",
        h1: "Compress PDF Online",
        intro:
            "Reduce PDF file size in seconds. Upload your PDF, compress it, and download the smaller file.",
        bullets: [
            "Reduce PDF size quickly",
            "Fast online compression",
            "Simple upload → compress → download",
            "Works on Windows, Mac, and mobile",
        ],
        faq: [
            {
                q: "Is PDF compression free?",
                a: "Yes. Free users get limited usage. Pro users get unlimited access across all tools.",
            },
            {
                q: "Do failed compressions burn usage?",
                a: "No. Usage is counted only after a successful download.",
            },
            {
                q: "Do you store my PDF?",
                a: "Files are processed only as needed to complete compression and deliver your download.",
            },
        ],
        primaryCtaHref: "/pdf/compress",
        primaryCtaText: "Open Compress Tool →",
        secondaryCtaHref: "/pricing",
        secondaryCtaText: "Go Pro",
        canonical: `${SITE_URL}/compress/compress-pdf-online`,
    },

    "reduce-pdf-size": {
        slug: "reduce-pdf-size",
        tool: "compress-pdf",
        title: "Reduce PDF Size Online",
        description:
            "Reduce PDF size online quickly. Compress PDFs for email, uploads, and sharing. Fast and easy.",
        h1: "Reduce PDF Size",
        intro:
            "Need a smaller PDF? Reduce file size for faster sharing, uploading, or emailing.",
        bullets: [
            "Make PDFs smaller for easy sharing",
            "Useful for email attachments",
            "Simple workflow with instant download",
            "Works across devices",
        ],
        faq: [
            {
                q: "Will compression reduce quality?",
                a: "Compression can reduce file size and may affect quality depending on the PDF content.",
            },
            {
                q: "Can I compress large PDFs?",
                a: "Yes, but Pro is recommended for frequent or heavy usage.",
            },
            {
                q: "Will it burn usage if it fails?",
                a: "No. Usage counts only after successful download.",
            },
        ],
        primaryCtaHref: "/pdf/compress",
        primaryCtaText: "Reduce PDF Size →",
        secondaryCtaHref: "/pricing",
        secondaryCtaText: "Upgrade to Pro",
        canonical: `${SITE_URL}/compress/reduce-pdf-size`,
    },

    "compress-pdf-free": {
        slug: "compress-pdf-free",
        tool: "compress-pdf",
        title: "Compress PDF Free (No Signup)",
        description:
            "Compress PDF files for free online—no signup required. Reduce PDF file size quickly and securely.",
        h1: "Compress PDF Free",
        intro:
            "Compress PDFs online without installing software. Get a smaller file in seconds.",
        bullets: [
            "No signup required",
            "Fast compression",
            "Secure processing",
            "Instant download",
        ],
        faq: [
            {
                q: "Do I need an account?",
                a: "No. An account is only needed for managing Pro subscriptions.",
            },
            {
                q: "Does it work on mobile?",
                a: "Yes. Works on modern mobile browsers.",
            },
            {
                q: "Is there a usage limit?",
                a: "Free usage is limited per tool. Pro unlocks unlimited access across all tools.",
            },
        ],
        primaryCtaHref: "/pdf/compress",
        primaryCtaText: "Compress PDF Now →",
        secondaryCtaHref: "/pricing",
        secondaryCtaText: "Go Pro",
        canonical: `${SITE_URL}/compress/compress-pdf-free`,
    },

    "shrink-pdf-file": {
        slug: "shrink-pdf-file",
        tool: "compress-pdf",
        title: "Shrink PDF File Size",
        description:
            "Shrink PDF file size online. Compress PDFs to make them easier to upload and share.",
        h1: "Shrink PDF File Size",
        intro:
            "Shrink a PDF file quickly to meet upload limits or reduce storage usage.",
        bullets: [
            "Shrink PDF size fast",
            "Great for uploads and sharing",
            "Easy compression workflow",
            "Works on desktop and mobile",
        ],
        faq: [
            {
                q: "How much can a PDF shrink?",
                a: "It depends on the PDF content. Image-heavy PDFs often compress more than text-only PDFs.",
            },
            {
                q: "Is it safe?",
                a: "We process files only to complete the requested action and deliver your download.",
            },
            {
                q: "Do failed jobs count?",
                a: "No. Usage only counts after successful download.",
            },
        ],
        primaryCtaHref: "/pdf/compress",
        primaryCtaText: "Shrink PDF →",
        secondaryCtaHref: "/pricing",
        secondaryCtaText: "Upgrade to Pro",
        canonical: `${SITE_URL}/compress/shrink-pdf-file`,
    },

    "compress-pdf-for-email": {
        slug: "compress-pdf-for-email",
        tool: "compress-pdf",
        title: "Compress PDF for Email",
        description:
            "Compress PDF for email attachments. Reduce file size quickly so you can send PDFs easily.",
        h1: "Compress PDF for Email",
        intro:
            "Reduce PDF size so it fits email attachment limits. Compress and download in seconds.",
        bullets: [
            "Great for email attachment limits",
            "Fast online compression",
            "Download instantly",
            "Works on any device",
        ],
        faq: [
            {
                q: "What email size limits does this help with?",
                a: "Many email providers have attachment limits. Compressing can help your PDF fit within those limits.",
            },
            {
                q: "Will it keep the content readable?",
                a: "Most PDFs remain readable after compression. Results may vary based on content.",
            },
            {
                q: "Does failure burn usage?",
                a: "No. Usage only counts after successful download.",
            },
        ],
        primaryCtaHref: "/pdf/compress",
        primaryCtaText: "Compress for Email →",
        secondaryCtaHref: "/pricing",
        secondaryCtaText: "Go Pro",
        canonical: `${SITE_URL}/compress/compress-pdf-for-email`,
    },
};

// ---------- Metadata ----------
export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const page = COMPRESS_PAGES[slug];
    if (!page) return {};

    return {
        title: page.title,
        description: page.description,
        alternates: {
            canonical: page.canonical || `${SITE_URL}/compress/${page.slug}`,
        },
        openGraph: {
            title: page.title,
            description: page.description,
            url: page.canonical || `${SITE_URL}/compress/${page.slug}`,
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
export default async function ProgrammaticCompressSeoPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const page = COMPRESS_PAGES[slug];
    if (!page) return notFound();

    return (
        <main className="min-h-screen bg-gradient-to-b from-white via-white to-neutral-50">
            <section className="border-b bg-gradient-to-r from-fuchsia-50 via-white to-cyan-50">
                <div className="mx-auto max-w-5xl px-4 py-10">
                    <div className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs text-neutral-700 shadow-sm">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        Tool • Compress PDF
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
                    <EmbedPdfCompressTool />
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
                        <Link className="underline" href="/pdf/compress">
                            Open Compress Tool
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
    return Object.keys(COMPRESS_PAGES).map((slug) => ({ slug }));
}
