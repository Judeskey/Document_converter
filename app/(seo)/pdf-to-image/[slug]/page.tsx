import Link from "next/link";
import { notFound } from "next/navigation";
import EmbedPdfToImageTool from "@/components/seo/EmbedPdfToImageTool";

// ---------- SEO DATA (PDF TO IMAGE) ----------
type SeoPage = {
    slug: string;
    tool: "pdf-to-image";
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

const P2I_PAGES: Record<string, SeoPage> = {
    "pdf-to-image-online": {
        slug: "pdf-to-image-online",
        tool: "pdf-to-image",
        title: "PDF to Image Online Free",
        description:
            "Convert PDF to images online for free. Turn PDF pages into JPG or PNG quickly. Fast, secure, and easy.",
        h1: "PDF to Image Online",
        intro:
            "Convert PDF pages into images in seconds. Upload your PDF, choose the image format, and download.",
        bullets: [
            "Convert PDF pages to JPG/PNG",
            "Fast browser-based conversion",
            "Secure processing and easy download",
            "Works on Windows, Mac, and mobile",
        ],
        faq: [
            {
                q: "Is PDF to Image free to use?",
                a: "Yes. Free users get limited usage per tool. Pro users get unlimited access across all tools.",
            },
            {
                q: "Will failed conversions burn usage?",
                a: "No. Usage is counted only after a successful download.",
            },
            {
                q: "Do you store my PDFs?",
                a: "Files are processed only as needed to complete your request and deliver your download.",
            },
        ],
        primaryCtaHref: "/pdf/to-image",
        primaryCtaText: "Open PDF to Image Tool →",
        secondaryCtaHref: "/pricing",
        secondaryCtaText: "Go Pro",
        canonical: `${SITE_URL}/pdf-to-image/pdf-to-image-online`,
    },

    "pdf-to-jpg": {
        slug: "pdf-to-jpg",
        tool: "pdf-to-image",
        title: "PDF to JPG Converter Online",
        description:
            "Convert PDF to JPG online. Turn PDF pages into JPG images quickly with instant download.",
        h1: "Convert PDF to JPG",
        intro:
            "Need JPG images from a PDF? Convert PDF pages into JPG images online with a simple workflow.",
        bullets: [
            "Convert PDF pages to JPG",
            "Great for sharing and compatibility",
            "Fast upload → convert → download",
            "Works on all modern browsers",
        ],
        faq: [
            {
                q: "Can I convert multiple pages?",
                a: "Yes. PDF pages can be converted into images depending on the tool options.",
            },
            {
                q: "Does it keep quality?",
                a: "Pages are converted into image outputs. Exact results depend on content and settings.",
            },
            {
                q: "Do failed conversions consume usage?",
                a: "No. Usage only counts after successful download.",
            },
        ],
        primaryCtaHref: "/pdf/to-image",
        primaryCtaText: "Convert PDF to JPG →",
        secondaryCtaHref: "/pricing",
        secondaryCtaText: "Upgrade to Pro",
        canonical: `${SITE_URL}/pdf-to-image/pdf-to-jpg`,
    },

    "pdf-to-png": {
        slug: "pdf-to-png",
        tool: "pdf-to-image",
        title: "PDF to PNG Converter Online",
        description:
            "Convert PDF to PNG online. Turn PDF pages into PNG images quickly and securely.",
        h1: "Convert PDF to PNG",
        intro:
            "Convert PDF pages into PNG images online. PNG can be great for sharper text and certain workflows.",
        bullets: [
            "Convert PDF pages to PNG",
            "Simple and secure process",
            "Instant download when ready",
            "Works on desktop and mobile",
        ],
        faq: [
            {
                q: "Why choose PNG instead of JPG?",
                a: "PNG may preserve sharp edges better in some cases, especially for text-heavy pages.",
            },
            {
                q: "Will PNG files be larger?",
                a: "Often yes. PNG can produce larger files than JPG depending on content.",
            },
            {
                q: "Does failure burn usage?",
                a: "No. Usage only counts after successful download.",
            },
        ],
        primaryCtaHref: "/pdf/to-image",
        primaryCtaText: "Convert PDF to PNG →",
        secondaryCtaHref: "/pricing",
        secondaryCtaText: "Go Pro",
        canonical: `${SITE_URL}/pdf-to-image/pdf-to-png`,
    },

    "convert-pdf-to-images": {
        slug: "convert-pdf-to-images",
        tool: "pdf-to-image",
        title: "Convert PDF to Images",
        description:
            "Convert PDF to images online. Export PDF pages as image files quickly with DocConvertor.",
        h1: "Convert PDF to Images",
        intro:
            "Export PDF pages as images for sharing, printing, or editing. Convert quickly in your browser.",
        bullets: [
            "Convert pages to image format",
            "Fast, simple workflow",
            "Download results instantly",
            "Works on any modern device",
        ],
        faq: [
            {
                q: "Can I convert only selected pages?",
                a: "Depending on the tool UI, you may be able to choose specific pages.",
            },
            {
                q: "Is Pro required?",
                a: "Free usage is limited. Pro gives unlimited usage across all tools.",
            },
            {
                q: "Are my files stored?",
                a: "Files are processed only to complete the conversion and deliver downloads.",
            },
        ],
        primaryCtaHref: "/pdf/to-image",
        primaryCtaText: "Convert PDF to Images →",
        secondaryCtaHref: "/pricing",
        secondaryCtaText: "Upgrade to Pro",
        canonical: `${SITE_URL}/pdf-to-image/convert-pdf-to-images`,
    },

    "extract-images-from-pdf": {
        slug: "extract-images-from-pdf",
        tool: "pdf-to-image",
        title: "Extract Images from PDF",
        description:
            "Extract images from PDF by converting pages to image outputs. Quick and secure online workflow.",
        h1: "Extract Images from PDF",
        intro:
            "Need images from a PDF? Convert PDF pages to image files and download the results quickly.",
        bullets: [
            "Turn PDF pages into images",
            "Fast online conversion",
            "Easy download",
            "Great for quick extraction workflows",
        ],
        faq: [
            {
                q: "Does this extract embedded images directly?",
                a: "This converts pages into image outputs. If you need embedded-only extraction, results may vary by PDF.",
            },
            {
                q: "Will it work on scanned PDFs?",
                a: "Yes, scanned PDFs can be converted to images as well.",
            },
            {
                q: "Do failed attempts count?",
                a: "No. Usage only counts after a successful download.",
            },
        ],
        primaryCtaHref: "/pdf/to-image",
        primaryCtaText: "Extract Images →",
        secondaryCtaHref: "/pricing",
        secondaryCtaText: "Go Pro",
        canonical: `${SITE_URL}/pdf-to-image/extract-images-from-pdf`,
    },
};

// ---------- Metadata ----------
export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const page = P2I_PAGES[slug];
    if (!page) return {};

    return {
        title: page.title,
        description: page.description,
        alternates: {
            canonical: page.canonical || `${SITE_URL}/pdf-to-image/${page.slug}`,
        },
        openGraph: {
            title: page.title,
            description: page.description,
            url: page.canonical || `${SITE_URL}/pdf-to-image/${page.slug}`,
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
export default async function ProgrammaticPdfToImageSeoPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const page = P2I_PAGES[slug];
    if (!page) return notFound();

    return (
        <main className="min-h-screen bg-gradient-to-b from-white via-white to-neutral-50">
            <section className="border-b bg-gradient-to-r from-fuchsia-50 via-white to-cyan-50">
                <div className="mx-auto max-w-5xl px-4 py-10">
                    <div className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs text-neutral-700 shadow-sm">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        Tool • PDF to Image
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
                    <EmbedPdfToImageTool />
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
                        <Link className="underline" href="/pdf/to-image">
                            Open PDF to Image Tool
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
    return Object.keys(P2I_PAGES).map((slug) => ({ slug }));
}
