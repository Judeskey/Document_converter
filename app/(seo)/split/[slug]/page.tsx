import Link from "next/link";
import { notFound } from "next/navigation";
import EmbedPdfSplitTool from "@/components/seo/EmbedPdfSplitTool";

// ---------- SEO DATA (PDF SPLIT) ----------
type SeoPage = {
    slug: string;
    tool: "split-pdf";
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

const SPLIT_PAGES: Record<string, SeoPage> = {
    "split-pdf-online": {
        slug: "split-pdf-online",
        tool: "split-pdf",
        title: "Split PDF Online Free",
        description:
            "Split PDF files online for free. Separate pages or ranges from a PDF instantly. Fast and secure.",
        h1: "Split PDF Online",
        intro:
            "Split PDFs by page or range in seconds. Upload your file, choose how to split, and download instantly.",
        bullets: [
            "Split PDFs by page or range",
            "Fast browser-based processing",
            "Secure file handling",
            "Works on Windows, Mac, and mobile",
        ],
        faq: [
            {
                q: "Is the PDF Split tool free?",
                a: "Yes. Free users get limited usage. Pro users enjoy unlimited access across all tools.",
            },
            {
                q: "Will failed splits consume usage?",
                a: "No. Usage is counted only after a successful download.",
            },
            {
                q: "Do you store my PDFs?",
                a: "Files are processed only as needed to complete the split and deliver your download.",
            },
        ],
        primaryCtaHref: "/pdf/split",
        primaryCtaText: "Open PDF Split Tool →",
        secondaryCtaHref: "/pricing",
        secondaryCtaText: "Go Pro",
        canonical: `${SITE_URL}/split/split-pdf-online`,
    },

    "split-pdf-free": {
        slug: "split-pdf-free",
        tool: "split-pdf",
        title: "Split PDF Free (No Signup)",
        description:
            "Split PDF files online for free without signup. Extract pages or ranges instantly.",
        h1: "Split PDF Free",
        intro:
            "Split PDFs without installing software. Extract pages quickly with a simple online workflow.",
        bullets: [
            "No signup required",
            "Extract pages easily",
            "Fast online splitting",
            "Instant download",
        ],
        faq: [
            {
                q: "Do I need an account?",
                a: "No. An account is only needed for managing Pro subscriptions.",
            },
            {
                q: "Can I split large PDFs?",
                a: "Yes, but Pro is recommended for heavy or frequent usage.",
            },
            {
                q: "Is it mobile friendly?",
                a: "Yes. Works on modern mobile browsers.",
            },
        ],
        primaryCtaHref: "/pdf/split",
        primaryCtaText: "Split PDF Now →",
        secondaryCtaHref: "/pricing",
        secondaryCtaText: "Upgrade to Pro",
        canonical: `${SITE_URL}/split/split-pdf-free`,
    },

    "split-pdf-by-page": {
        slug: "split-pdf-by-page",
        tool: "split-pdf",
        title: "Split PDF by Page",
        description:
            "Split PDF by page online. Extract individual pages from a PDF quickly and securely.",
        h1: "Split PDF by Page",
        intro:
            "Need specific pages from a PDF? Split PDFs by page and download only what you need.",
        bullets: [
            "Extract individual pages",
            "Fast and simple workflow",
            "No software installation",
            "Secure processing",
        ],
        faq: [
            {
                q: "Can I extract one page?",
                a: "Yes. You can extract a single page or multiple pages.",
            },
            {
                q: "Does it keep page quality?",
                a: "Yes. Pages are preserved exactly as in the original PDF.",
            },
            {
                q: "Will failed attempts burn usage?",
                a: "No. Usage only counts after successful download.",
            },
        ],
        primaryCtaHref: "/pdf/split",
        primaryCtaText: "Split PDF by Page →",
        secondaryCtaHref: "/pricing",
        secondaryCtaText: "Go Pro",
        canonical: `${SITE_URL}/split/split-pdf-by-page`,
    },

    "split-pdf-by-range": {
        slug: "split-pdf-by-range",
        tool: "split-pdf",
        title: "Split PDF by Range",
        description:
            "Split PDF by page range online. Extract selected pages quickly and easily.",
        h1: "Split PDF by Range",
        intro:
            "Choose page ranges to split PDFs online and download only the sections you need.",
        bullets: [
            "Split by custom page ranges",
            "Simple and fast workflow",
            "No installation required",
            "Works across devices",
        ],
        faq: [
            {
                q: "Can I extract multiple ranges?",
                a: "Yes. Depending on the tool UI and plan, multiple ranges may be supported.",
            },
            {
                q: "Is Pro required?",
                a: "Free usage is limited. Pro gives unlimited access.",
            },
            {
                q: "Are files stored?",
                a: "Files are processed only to perform the split and deliver results.",
            },
        ],
        primaryCtaHref: "/pdf/split",
        primaryCtaText: "Split PDF by Range →",
        secondaryCtaHref: "/pricing",
        secondaryCtaText: "Upgrade to Pro",
        canonical: `${SITE_URL}/split/split-pdf-by-range`,
    },

    "extract-pages-from-pdf": {
        slug: "extract-pages-from-pdf",
        tool: "split-pdf",
        title: "Extract Pages from PDF",
        description:
            "Extract pages from PDF online. Select and download only the pages you need.",
        h1: "Extract Pages from PDF",
        intro:
            "Extract specific pages from PDFs with an easy, secure online tool.",
        bullets: [
            "Extract only required pages",
            "Fast online processing",
            "Simple download",
            "Great for document workflows",
        ],
        faq: [
            {
                q: "Is extraction the same as splitting?",
                a: "Yes. Extracting pages is a common form of splitting PDFs.",
            },
            {
                q: "Does it support large PDFs?",
                a: "Yes, but Pro is recommended for frequent or large jobs.",
            },
            {
                q: "Do failed extractions count?",
                a: "No. Usage only counts after a successful download.",
            },
        ],
        primaryCtaHref: "/pdf/split",
        primaryCtaText: "Extract Pages →",
        secondaryCtaHref: "/pricing",
        secondaryCtaText: "Go Pro",
        canonical: `${SITE_URL}/split/extract-pages-from-pdf`,
    },
};

// ---------- Metadata ----------
export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const page = SPLIT_PAGES[slug];
    if (!page) return {};

    return {
        title: page.title,
        description: page.description,
        alternates: {
            canonical: page.canonical || `${SITE_URL}/split/${page.slug}`,
        },
        openGraph: {
            title: page.title,
            description: page.description,
            url: page.canonical || `${SITE_URL}/split/${page.slug}`,
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
export default async function ProgrammaticPdfSplitSeoPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const page = SPLIT_PAGES[slug];
    if (!page) return notFound();

    return (
        <main className="min-h-screen bg-gradient-to-b from-white via-white to-neutral-50">
            <section className="border-b bg-gradient-to-r from-fuchsia-50 via-white to-cyan-50">
                <div className="mx-auto max-w-5xl px-4 py-10">
                    <div className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs text-neutral-700 shadow-sm">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        Tool • PDF Split
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

                        {page.secondaryCtaHref && page.secondaryCtaText && (
                            <Link
                                href={page.secondaryCtaHref}
                                className="inline-flex items-center justify-center rounded-full border bg-white px-5 py-2 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
                            >
                                {page.secondaryCtaText}
                            </Link>
                        )}
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
                    <EmbedPdfSplitTool />
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
                        <Link href="/pdf/split" className="underline">
                            Open PDF Split Tool
                        </Link>
                        <Link href="/pricing" className="underline">
                            Pricing
                        </Link>
                        <Link href="/privacy" className="underline">
                            Privacy
                        </Link>
                        <Link href="/faq" className="underline">
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
    return Object.keys(SPLIT_PAGES).map((slug) => ({ slug }));
}
