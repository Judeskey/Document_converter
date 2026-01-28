import Link from "next/link";
import { notFound } from "next/navigation";
import EmbedImageConvertTool from "@/components/seo/EmbedImageConvertTool";

// ---------- SEO DATA (IMAGE CONVERTER) ----------
type SeoPage = {
    slug: string;
    tool: "image-convert";
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

const IMAGE_PAGES: Record<string, SeoPage> = {
    "convert-image-online": {
        slug: "convert-image-online",
        tool: "image-convert",
        title: "Convert Image Online Free",
        description:
            "Convert images online for free. Change PNG, JPG, WebP, AVIF and more instantly. Fast, secure, and easy.",
        h1: "Convert Image Online",
        intro:
            "Convert images in seconds. Upload your image, choose the target format, and download instantly.",
        bullets: [
            "Convert PNG, JPG, WebP, AVIF and more",
            "Fast conversion in your browser",
            "Simple download after conversion",
            "Works on Windows, Mac, iPhone, and Android",
        ],
        faq: [
            {
                q: "Is the Image Converter free to use?",
                a: "Yes. Free users can use the tool with limited usage. Pro users get unlimited access across all tools.",
            },
            {
                q: "Will I be charged if a conversion fails?",
                a: "No. Usage is counted only after a successful download. Failed conversions don’t consume usage.",
            },
            {
                q: "Do you store my images permanently?",
                a: "Files are processed only as needed to complete your request and deliver your download.",
            },
        ],
        primaryCtaHref: "/image/convert",
        primaryCtaText: "Open Image Converter →",
        secondaryCtaHref: "/pricing",
        secondaryCtaText: "Go Pro",
        canonical: `${SITE_URL}/image/convert-image-online`,
    },

    "image-converter-free": {
        slug: "image-converter-free",
        tool: "image-convert",
        title: "Image Converter Free (No Signup)",
        description:
            "Use a free image converter online—no signup required. Convert images quickly with a clean workflow and instant download.",
        h1: "Free Image Converter",
        intro:
            "Convert images online without installing any software. Choose a format and download the result in seconds.",
        bullets: [
            "No installation needed",
            "Works on mobile and desktop",
            "Convert common image formats quickly",
            "Instant download when done",
        ],
        faq: [
            {
                q: "Do I need an account to convert images?",
                a: "No. You can use the tool without an account. An account is needed to manage Pro subscriptions.",
            },
            {
                q: "What formats are supported?",
                a: "We support popular formats such as PNG, JPG, WebP, and others depending on the tool options.",
            },
            {
                q: "Does it work on phones?",
                a: "Yes. DocConvertor works on modern mobile browsers and desktops.",
            },
        ],
        primaryCtaHref: "/image/convert",
        primaryCtaText: "Convert Images Now →",
        secondaryCtaHref: "/pricing",
        secondaryCtaText: "Upgrade to Pro",
        canonical: `${SITE_URL}/image/image-converter-free`,
    },

    "png-to-jpg": {
        slug: "png-to-jpg",
        tool: "image-convert",
        title: "PNG to JPG Converter Online",
        description:
            "Convert PNG to JPG online in seconds. Fast, simple, and secure. Download your JPG instantly.",
        h1: "Convert PNG to JPG",
        intro:
            "Need a smaller file or a more compatible format? Convert PNG images to JPG quickly online.",
        bullets: [
            "Fast PNG to JPG conversion",
            "Great for sharing and compatibility",
            "Simple upload → convert → download",
            "Works on Mac, Windows, and mobile",
        ],
        faq: [
            {
                q: "Will converting PNG to JPG reduce file size?",
                a: "Often yes. JPG can be smaller than PNG depending on the image content and settings.",
            },
            {
                q: "Will I lose quality converting to JPG?",
                a: "JPG uses compression. Most images look great, but exact results can vary.",
            },
            {
                q: "Do failed conversions burn usage?",
                a: "No. Usage is only counted after a successful download.",
            },
        ],
        primaryCtaHref: "/image/convert",
        primaryCtaText: "Convert PNG to JPG →",
        secondaryCtaHref: "/pricing",
        secondaryCtaText: "Go Pro",
        canonical: `${SITE_URL}/image/png-to-jpg`,
    },

    "jpg-to-png": {
        slug: "jpg-to-png",
        tool: "image-convert",
        title: "JPG to PNG Converter Online",
        description:
            "Convert JPG to PNG online quickly. Get a PNG version of your image with an easy upload and download flow.",
        h1: "Convert JPG to PNG",
        intro:
            "Convert JPG images to PNG for better compatibility in some workflows or to preserve transparency in edits.",
        bullets: [
            "Fast JPG to PNG conversion",
            "Simple upload and download",
            "Works in modern browsers",
            "Best for common image workflows",
        ],
        faq: [
            {
                q: "Does PNG support transparency?",
                a: "Yes. PNG supports transparency, but a JPG file itself does not include transparency data.",
            },
            {
                q: "Will PNG always be smaller than JPG?",
                a: "Not always. PNG can be larger depending on image content.",
            },
            {
                q: "Will I be charged if it fails?",
                a: "No. Usage is counted only after successful download.",
            },
        ],
        primaryCtaHref: "/image/convert",
        primaryCtaText: "Convert JPG to PNG →",
        secondaryCtaHref: "/pricing",
        secondaryCtaText: "Upgrade to Pro",
        canonical: `${SITE_URL}/image/jpg-to-png`,
    },

    "webp-to-jpg": {
        slug: "webp-to-jpg",
        tool: "image-convert",
        title: "WebP to JPG Converter Online",
        description:
            "Convert WebP to JPG online for compatibility. Fast conversion with instant download.",
        h1: "Convert WebP to JPG",
        intro:
            "If a website or app doesn’t support WebP, convert your WebP images to JPG quickly online.",
        bullets: [
            "Fast WebP to JPG conversion",
            "Great for compatibility",
            "Download instantly",
            "Works on desktop and mobile",
        ],
        faq: [
            {
                q: "Why convert WebP to JPG?",
                a: "JPG is widely supported across apps and platforms, while WebP may not be supported everywhere.",
            },
            {
                q: "Can I convert multiple images?",
                a: "You can convert images depending on the tool’s UI and your plan. Pro is best for frequent usage.",
            },
            {
                q: "Does it burn usage on failure?",
                a: "No. Usage only counts after successful download.",
            },
        ],
        primaryCtaHref: "/image/convert",
        primaryCtaText: "Convert WebP to JPG →",
        secondaryCtaHref: "/pricing",
        secondaryCtaText: "Go Pro",
        canonical: `${SITE_URL}/image/webp-to-jpg`,
    },
};

// ---------- Metadata ----------
export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const page = IMAGE_PAGES[slug];
    if (!page) return {};

    return {
        title: page.title,
        description: page.description,
        alternates: {
            canonical: page.canonical || `${SITE_URL}/image/${page.slug}`,
        },
        openGraph: {
            title: page.title,
            description: page.description,
            url: page.canonical || `${SITE_URL}/image/${page.slug}`,
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
export default async function ProgrammaticImageSeoPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const page = IMAGE_PAGES[slug];
    if (!page) return notFound();

    return (
        <main className="min-h-screen bg-gradient-to-b from-white via-white to-neutral-50">
            {/* Hero */}
            <section className="border-b bg-gradient-to-r from-fuchsia-50 via-white to-cyan-50">
                <div className="mx-auto max-w-5xl px-4 py-10">
                    <div className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs text-neutral-700 shadow-sm">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        Tool • Image Converter
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

            {/* Tool embed */}
            <section className="mx-auto max-w-5xl px-4 py-10">
                <div className="rounded-2xl border bg-white p-4 shadow-sm sm:p-6">
                    <EmbedImageConvertTool />
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
                            href="/image/convert"
                        >
                            Open Image Converter
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

// ---------- Static generation ----------
export function generateStaticParams() {
    return Object.keys(IMAGE_PAGES).map((slug) => ({ slug }));
}
