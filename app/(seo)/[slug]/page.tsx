import Link from "next/link";
import { notFound } from "next/navigation";
import EmbedPdfMergeTool from "@/components/seo/EmbedPdfMergeTool";
import TrustNotice from "@/components/TrustNotice";


// ---------- SEO DATA (MERGE PDF PILOT) ----------
type SeoPage = {
    slug: string;
    tool: "merge-pdf";
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

const MERGE_PAGES: Record<string, SeoPage> = {
    "merge-pdf-online": {
        slug: "merge-pdf-online",
        tool: "merge-pdf",
        title: "Merge PDF Online Free",
        description:
            "Merge PDF files online for free. Combine multiple PDFs into one document quickly. Fast, secure, and easy.",
        h1: "Merge PDF Online",
        intro:
            "Combine multiple PDFs into one file in seconds. Upload your PDFs, reorder pages, and download the merged result.",
        bullets: [
            "Fast online PDF merging in your browser",
            "Reorder files before merging",
            "Secure processing and simple download",
            "Works on Windows, Mac, iPhone, and Android",
        ],
        faq: [
            {
                q: "Is Merge PDF free to use?",
                a: "Yes. Free users can merge PDFs with limited usage. Pro users get unlimited access across all tools.",
            },
            {
                q: "Will I be charged if the merge fails?",
                a: "No. Usage is counted only after a successful download. Failed merges don’t consume usage.",
            },
            {
                q: "Are my PDFs stored permanently?",
                a: "Files are processed only as needed to complete your request and deliver your download.",
            },
        ],
        primaryCtaHref: "/pdf/merge",
        primaryCtaText: "Open Merge Tool →",
        secondaryCtaHref: "/pricing",
        secondaryCtaText: "Go Pro",
        canonical: `${SITE_URL}/merge-pdf-online`,
    },

    "merge-pdf-free": {
        slug: "merge-pdf-free",
        tool: "merge-pdf",
        title: "Merge PDF Free (No Signup)",
        description:
            "Merge PDF files for free online—no signup required. Combine PDFs instantly with an easy, secure workflow.",
        h1: "Merge PDF Free",
        intro:
            "Need to combine PDFs quickly? Use DocConvertor to merge PDFs online for free with a clean, simple experience.",
        bullets: [
            "No installation required",
            "Combine PDFs in minutes",
            "Easy reorder before merging",
            "Download instantly when ready",
        ],
        faq: [
            {
                q: "Do I need an account to merge PDFs?",
                a: "No. You can use the tool without creating an account. An account is needed for subscription management.",
            },
            {
                q: "Is there a watermark?",
                a: "Merged PDFs are delivered as standard files. Pro is recommended for frequent use and unlimited access.",
            },
            {
                q: "Does it work on mobile?",
                a: "Yes. DocConvertor works on modern mobile browsers and desktops.",
            },
        ],
        primaryCtaHref: "/pdf/merge",
        primaryCtaText: "Merge PDFs Now →",
        secondaryCtaHref: "/pricing",
        secondaryCtaText: "Upgrade to Pro",
        canonical: `${SITE_URL}/merge-pdf-free`,
    },

    "merge-pdf-without-watermark": {
        slug: "merge-pdf-without-watermark",
        tool: "merge-pdf",
        title: "Merge PDF Without Watermark",
        description:
            "Merge PDFs without watermark using DocConvertor. Combine files quickly with a trusted, modern workflow.",
        h1: "Merge PDF Without Watermark",
        intro:
            "If you’re looking for a clean output, DocConvertor merges PDFs with a straightforward download experience.",
        bullets: [
            "Clean output and professional results",
            "Fast merging with reorder support",
            "Secure processing",
            "Pro recommended for unlimited usage",
        ],
        faq: [
            {
                q: "Is the output watermarked?",
                a: "DocConvertor aims to provide clean results. If you need unlimited access, Pro is recommended.",
            },
            {
                q: "What’s the difference between Free and Pro?",
                a: "Free has limited usage per tool; Pro unlocks unlimited access across all tools.",
            },
            {
                q: "Do you keep my files?",
                a: "Files are processed only as necessary to complete your request and deliver the download.",
            },
        ],
        primaryCtaHref: "/pdf/merge",
        primaryCtaText: "Open Merge Tool →",
        secondaryCtaHref: "/pricing",
        secondaryCtaText: "Go Pro",
        canonical: `${SITE_URL}/merge-pdf-without-watermark`,
    },

    "merge-pdf-for-mac": {
        slug: "merge-pdf-for-mac",
        tool: "merge-pdf",
        title: "Merge PDF on Mac (Online)",
        description:
            "Merge PDF files on Mac using DocConvertor. No installation needed—combine PDFs online in your browser.",
        h1: "Merge PDF on Mac",
        intro:
            "Merge PDFs directly in your browser on macOS. Upload files, reorder them, and download the merged PDF.",
        bullets: [
            "Works on macOS (Safari/Chrome)",
            "No software installation required",
            "Reorder before merging",
            "Fast download after merge",
        ],
        faq: [
            {
                q: "Does Merge PDF work on Safari?",
                a: "Yes. DocConvertor supports modern browsers. If you face issues, try Chrome for best performance.",
            },
            {
                q: "Can I merge large PDFs?",
                a: "It depends on browser and file size. Pro is recommended for heavy usage and a smoother workflow.",
            },
            {
                q: "Is it secure?",
                a: "We process files only to perform the requested conversion and deliver the result.",
            },
        ],
        primaryCtaHref: "/pdf/merge",
        primaryCtaText: "Merge on Mac →",
        secondaryCtaHref: "/pricing",
        secondaryCtaText: "Go Pro",
        canonical: `${SITE_URL}/merge-pdf-for-mac`,
    },

    "merge-pdf-for-windows": {
        slug: "merge-pdf-for-windows",
        tool: "merge-pdf",
        title: "Merge PDF on Windows (Online)",
        description:
            "Merge PDF files on Windows using DocConvertor. Combine PDFs online with reorder support and instant download.",
        h1: "Merge PDF on Windows",
        intro:
            "Merge PDFs on Windows without installing software. Upload, reorder, merge, and download the final PDF.",
        bullets: [
            "Works on Windows 10/11",
            "Best experience on Chrome/Edge",
            "Reorder PDFs before merge",
            "Download instantly",
        ],
        faq: [
            {
                q: "Does it work with Microsoft Edge?",
                a: "Yes. Edge works well for merging PDFs.",
            },
            {
                q: "Do I need to sign in?",
                a: "No. Sign-in is optional for free usage. Pro requires an account to manage subscription access.",
            },
            {
                q: "Do failed merges burn usage?",
                a: "No. Usage is counted only after a successful download.",
            },
        ],
        primaryCtaHref: "/pdf/merge",
        primaryCtaText: "Merge on Windows →",
        secondaryCtaHref: "/pricing",
        secondaryCtaText: "Go Pro",
        canonical: `${SITE_URL}/merge-pdf-for-windows`,
    },
};

// ---------- Metadata ----------
export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const page = MERGE_PAGES[slug];
    if (!page) return {};

    return {
        title: page.title,
        description: page.description,
        alternates: {
            canonical: page.canonical || `${SITE_URL}/${page.slug}`,
        },
        openGraph: {
            title: page.title,
            description: page.description,
            url: page.canonical || `${SITE_URL}/${page.slug}`,
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
export default async function ProgrammaticSeoPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const page = MERGE_PAGES[slug];
    if (!page) return notFound();

    return (
        <main className="min-h-screen bg-gradient-to-b from-white via-white to-neutral-50">
            {/* Hero */}
            <section className="border-b bg-gradient-to-r from-fuchsia-50 via-white to-cyan-50">
                <div className="mx-auto max-w-5xl px-4 py-10">
                    <div className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs text-neutral-700 shadow-sm">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        Tool • PDF Merge
                    </div>

                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
                        {page.h1}
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">
                        {page.intro}
                    </p>
                    <TrustNotice />
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
                    <p className="mt-3 text-xs text-neutral-500">
                        Works entirely in your browser — no software downloads or installations.
                    </p>

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

            {/* Tool embed */}
            <section className="mx-auto max-w-5xl px-4 py-10">
                <div className="rounded-2xl border bg-white p-4 shadow-sm sm:p-6">
                    <EmbedPdfMergeTool />
                </div>

                {/* FAQ */}
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

                {/* Internal links */}
                <div className="mt-10 text-sm text-neutral-600">
                    Related:
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
                        <Link
                            className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-600"
                            href="/pdf/merge"
                        >
                            Merge PDF Tool
                        </Link>
                        <Link
                            className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-600"
                            href="/pricing"
                        >
                            Pricing
                        </Link>
                        <Link
                            className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-600"
                            href="/privacy"
                        >
                            Privacy
                        </Link>
                        <Link
                            className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-600"
                            href="/faq"
                        >
                            FAQ
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}

// ---------- Static generation: build the pages at build-time ----------
export function generateStaticParams() {
    return Object.keys(MERGE_PAGES).map((slug) => ({ slug }));
}
