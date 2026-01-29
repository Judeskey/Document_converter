import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://docconvertor.com";

// --- Programmatic SEO slugs ---
const IMAGE_SLUGS = [
    "convert-image-online",
    "image-converter-free",
    "png-to-jpg",
    "jpg-to-png",
    "webp-to-jpg",
];

const SPLIT_SLUGS = [
    "split-pdf-online",
    "split-pdf-free",
    "split-pdf-by-page",
    "split-pdf-by-range",
    "extract-pages-from-pdf",
];

const PDF_TO_IMAGE_SLUGS = [
    "pdf-to-image-online",
    "pdf-to-jpg",
    "pdf-to-png",
    "convert-pdf-to-images",
    "extract-images-from-pdf",
];

const COMPRESS_SLUGS = [
    "compress-pdf-online",
    "reduce-pdf-size",
    "compress-pdf-free",
    "shrink-pdf-file",
    "compress-pdf-for-email",
];

const PDF_TO_WORD_SLUGS = [
    "pdf-to-word-online",
    "pdf-to-docx",
    "convert-pdf-to-word-free",
    "pdf-to-word-for-mac",
    "pdf-to-word-for-windows",
];

const OCR_TO_WORD_SLUGS = [
    "ocr-pdf-to-word",
    "scan-pdf-to-word",
    "pdf-ocr-to-docx",
    "convert-scanned-pdf-to-word",
    "extract-text-from-scanned-pdf",
];

// --- Guides (new) ---
const GUIDE_SLUGS = [
    "pdf-to-word",
    "ocr-pdf-to-word",
    "merge-pdf",
    "split-pdf",
    "compress-pdf",
    "pdf-to-image",
    "image-converter",
];

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();

    const staticPages = [
        "/",
        "/pricing",
        "/tools",
        "/signin",
        "/privacy",
        "/terms",
        "/about",
        "/faq",

        // Tool pages (the “hub” pages)
        "/image/convert",
        "/pdf/merge",
        "/pdf/split",
        "/pdf/to-image",
        "/pdf/compress",
        "/pdf/to-word",
        "/pdf/ocr-to-word",

        // Guides index (new)
        "/guides",
    ];

    const programmaticPages = [
        ...IMAGE_SLUGS.map((s) => `/image/${s}`),
        ...SPLIT_SLUGS.map((s) => `/split/${s}`),
        ...PDF_TO_IMAGE_SLUGS.map((s) => `/pdf-to-image/${s}`),
        ...COMPRESS_SLUGS.map((s) => `/compress/${s}`),
        ...PDF_TO_WORD_SLUGS.map((s) => `/pdf-to-word/${s}`),
        ...OCR_TO_WORD_SLUGS.map((s) => `/pdf-ocr-to-word/${s}`),

        // Guides (new)
        ...GUIDE_SLUGS.map((s) => `/guides/${s}`),
    ];

    const urls = [...staticPages, ...programmaticPages].map((path) => ({
        url: `${SITE_URL}${path}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: path === "/" ? 1 : 0.7,
    }));

    return urls;
}
