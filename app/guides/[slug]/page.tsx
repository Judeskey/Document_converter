import Link from "next/link";
import { notFound } from "next/navigation";

// Optional: if you have the TrustNotice component already, you can import it.
// If you don't, remove these 2 lines.
// import TrustNotice from "@/components/TrustNotice";

type GuideSlug =
    | "pdf-to-word"
    | "ocr-pdf-to-word"
    | "merge-pdf"
    | "split-pdf"
    | "compress-pdf"
    | "pdf-to-image"
    | "image-converter";

type Guide = {
    title: string;
    subtitle: string;
    icon: string;
    tag: string;
    openToolHref: string;
    steps: string[];
    bestFor: string[];
    tips: string[];
    faqs: { q: string; a: string }[];
};

const GUIDES: Record<GuideSlug, Guide> = {
    "pdf-to-word": {
        title: "How to Convert PDF to Word",
        subtitle:
            "Step-by-step guide to convert PDFs into editable Word (DOCX) files online using DocConvertor.",
        icon: "📄",
        tag: "Popular",
        openToolHref: "/pdf/to-word",
        steps: [
            "Open the PDF → Word tool.",
            "Upload your PDF file.",
            "Adjust options if needed.",
            "Convert and download your DOCX.",
        ],
        bestFor: [
            "Text-based PDFs",
            "Reports, forms, contracts",
            "Quick edits in Word",
        ],
        tips: [
            "If your PDF is scanned (image-based), use the OCR PDF → Word guide instead.",
            "For best formatting, start with clean PDFs (not screenshots).",
            "If tables shift, try re-saving the PDF from the source app and convert again.",
        ],
        faqs: [
            {
                q: "Does this work on scanned PDFs?",
                a: "Scanned PDFs usually need OCR. Use the OCR PDF → Word guide for best results.",
            },
            {
                q: "Is my file stored permanently?",
                a: "No. Files are processed to complete your request and are not kept permanently.",
            },
        ],
    },

    "ocr-pdf-to-word": {
        title: "How to Convert Scanned PDF to Word (OCR)",
        subtitle:
            "Turn scanned PDFs into editable Word documents using OCR for text extraction.",
        icon: "🧠",
        tag: "Scanned PDFs",
        openToolHref: "/pdf/ocr-to-word",
        steps: [
            "Open the OCR PDF → Word tool.",
            "Upload your scanned PDF.",
            "Run OCR to extract text.",
            "Download the editable DOCX.",
        ],
        bestFor: ["Scanned documents", "Photos saved as PDF", "Image-based PDFs"],
        tips: [
            "Use clear scans (300 DPI if possible) for best OCR accuracy.",
            "If text is skewed, straighten the scan before uploading.",
            "For multi-language documents, keep the scan high contrast.",
        ],
        faqs: [
            {
                q: "Why does OCR sometimes miss words?",
                a: "Low-quality scans, blur, skew, or faint text reduce accuracy. A clearer scan usually fixes it.",
            },
            {
                q: "Is OCR slower than normal PDF → Word?",
                a: "Yes—OCR needs extra processing to read text from images.",
            },
        ],
    },

    "merge-pdf": {
        title: "How to Merge PDF Files",
        subtitle:
            "Combine multiple PDFs into one file. Upload, reorder, merge, and download.",
        icon: "🧩",
        tag: "Fast",
        openToolHref: "/pdf/merge",
        steps: [
            "Open the Merge PDF tool.",
            "Upload multiple PDFs.",
            "Reorder files/pages as needed.",
            "Merge and download your combined PDF.",
        ],
        bestFor: ["Combining documents", "Submitting one final PDF", "Reports"],
        tips: [
            "Rename your files before upload to stay organized.",
            "Double-check the order before merging.",
            "If a file fails, try re-saving it as PDF and retry.",
        ],
        faqs: [
            { q: "Can I reorder before merging?", a: "Yes. Reorder files/pages before merging." },
            {
                q: "Do failed merges count against usage?",
                a: "No. Usage should count only after a successful result.",
            },
        ],
    },

    "split-pdf": {
        title: "How to Split a PDF",
        subtitle:
            "Split a PDF by pages, ranges, or extract selected pages into a new PDF.",
        icon: "✂️",
        tag: "Flexible",
        openToolHref: "/pdf/split",
        steps: [
            "Open the Split PDF tool.",
            "Upload your PDF.",
            "Choose split mode (pages/ranges).",
            "Process and download the result.",
        ],
        bestFor: ["Extracting pages", "Separating chapters", "Reducing file size"],
        tips: [
            "Use ranges like 1-3, 7-9 for clean extraction.",
            "If you need multiple parts, use the range mode.",
            "For huge PDFs, splitting first can make other steps faster.",
        ],
        faqs: [
            {
                q: "Can I extract just one page?",
                a: "Yes—choose the page number or a 1-page range.",
            },
            {
                q: "Do I get a ZIP for multiple parts?",
                a: "If the tool outputs multiple files, it may package them as a ZIP.",
            },
        ],
    },

    "compress-pdf": {
        title: "How to Compress a PDF",
        subtitle:
            "Reduce PDF size for email, uploads, and faster sharing—without installing software.",
        icon: "📦",
        tag: "Smaller files",
        openToolHref: "/pdf/compress",
        steps: [
            "Open the Compress PDF tool.",
            "Upload your PDF.",
            "Choose compression level if available.",
            "Compress and download the smaller PDF.",
        ],
        bestFor: ["Email attachments", "Online submissions", "Storage savings"],
        tips: [
            "If quality drops too much, try a lighter compression setting.",
            "Large scanned PDFs compress best after converting/optimizing images.",
            "If your PDF is already optimized, size reduction may be limited.",
        ],
        faqs: [
            { q: "Will compressing reduce quality?", a: "It can, depending on compression level." },
            { q: "Can I compress scanned PDFs?", a: "Yes—scanned PDFs often compress very well." },
        ],
    },

    "pdf-to-image": {
        title: "How to Convert PDF to Images",
        subtitle:
            "Export PDF pages to JPG/PNG images for sharing, printing, or design work.",
        icon: "🖼️",
        tag: "Export pages",
        openToolHref: "/pdf/to-image",
        steps: [
            "Open the PDF → Image tool.",
            "Upload your PDF.",
            "Select output format (JPG/PNG).",
            "Convert and download images.",
        ],
        bestFor: ["Sharing single pages", "Using pages in design", "Previews"],
        tips: [
            "PNG is better for sharp text; JPG is smaller for photos.",
            "If you only need a few pages, convert those pages only (if available).",
            "For printing, use higher quality settings when offered.",
        ],
        faqs: [
            { q: "Do I get one image per page?", a: "Yes—typically one image per PDF page." },
            { q: "Will it download as ZIP?", a: "If there are multiple images, it may download as ZIP." },
        ],
    },

    "image-converter": {
        title: "How to Convert Images Online",
        subtitle:
            "Convert PNG/JPG/WebP/AVIF formats quickly—ideal for web, social, and documents.",
        icon: "✨",
        tag: "Images",
        openToolHref: "/image/convert",
        steps: [
            "Open the Image Converter tool.",
            "Upload your image (PNG/JPG/WebP/AVIF).",
            "Pick the output format.",
            "Convert and download your new image.",
        ],
        bestFor: ["Web images", "Social media", "Reducing file size"],
        tips: [
            "Use WebP for web performance (smaller size).",
            "Use PNG for transparency or sharp text/logos.",
            "If quality matters, avoid repeated conversions (convert once from the original).",
        ],
        faqs: [
            { q: "Which format is best for websites?", a: "WebP is usually best for performance." },
            { q: "Can I convert images with transparency?", a: "Yes—use PNG/WebP to preserve transparency." },
        ],
    },
};

export function generateStaticParams() {
    return Object.keys(GUIDES).map((slug) => ({ slug }));
}

// ✅ Next.js 16 fix: params is a Promise in some cases
export default async function GuidePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const guide = GUIDES[slug as GuideSlug];
    if (!guide) return notFound();

    const related = (Object.entries(GUIDES) as Array<[GuideSlug, Guide]>)
        .filter(([s]) => s !== slug)
        .slice(0, 4);

    return (
        <main className="mx-auto w-full max-w-6xl px-4 py-10">
            {/* Hero */}
            <section className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
                <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-700">
                        {guide.icon} Guide
                    </span>
                    <span className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-700">
                        {guide.tag}
                    </span>
                </div>

                <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                    {guide.title}
                </h1>

                <p className="mt-3 max-w-3xl text-base leading-7 text-neutral-600">
                    {guide.subtitle}
                </p>

                <p className="mt-4 max-w-3xl text-sm leading-6 text-neutral-600">
                    No software installation required. Your files are processed securely to complete
                    your request and are not kept permanently.
                </p>

                {/* If using TrustNotice globally, replace the paragraph above with: */}
                {/* <TrustNotice /> */}

                <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                        href={guide.openToolHref}
                        className="inline-flex items-center justify-center rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
                    >
                        Open Tool →
                    </Link>

                    <Link
                        href="/guides"
                        className="inline-flex items-center justify-center rounded-xl border border-neutral-300 bg-white px-5 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
                    >
                        All Guides
                    </Link>

                    <Link
                        href="/tools"
                        className="inline-flex items-center justify-center rounded-xl border border-neutral-300 bg-white px-5 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
                    >
                        Browse Tools
                    </Link>
                </div>
            </section>

            {/* Content grid */}
            <section className="mt-8 grid gap-6 lg:grid-cols-3">
                {/* Steps */}
                <div className="lg:col-span-2">
                    <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-neutral-900">Step-by-step</h2>
                        <div className="mt-4 grid gap-3">
                            {guide.steps.map((step, i) => (
                                <div
                                    key={step}
                                    className="flex gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-4"
                                >
                                    <div className="flex h-8 w-8 flex-none items-center justify-center rounded-xl bg-white text-sm font-semibold text-neutral-900 shadow-sm">
                                        {i + 1}
                                    </div>
                                    <div className="text-sm leading-6 text-neutral-700">{step}</div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />

                        <h3 className="mt-6 text-sm font-semibold text-neutral-900">
                            Best for
                        </h3>
                        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                            {guide.bestFor.map((item) => (
                                <li
                                    key={item}
                                    className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700"
                                >
                                    ✅ {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Tips */}
                    <div className="mt-6 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-neutral-900">Tips</h2>
                        <ul className="mt-4 grid gap-3">
                            {guide.tips.map((tip) => (
                                <li
                                    key={tip}
                                    className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm leading-6 text-neutral-700"
                                >
                                    💡 {tip}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* FAQ */}
                    <div className="mt-6 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-neutral-900">FAQ</h2>
                        <div className="mt-4 grid gap-3">
                            {guide.faqs.map((f) => (
                                <details
                                    key={f.q}
                                    className="group rounded-2xl border border-neutral-200 bg-white p-4"
                                >
                                    <summary className="cursor-pointer list-none text-sm font-semibold text-neutral-900">
                                        {f.q}
                                        <span className="float-right opacity-60 group-open:rotate-180">
                                            ▼
                                        </span>
                                    </summary>
                                    <p className="mt-3 text-sm leading-6 text-neutral-600">{f.a}</p>
                                </details>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <aside className="lg:col-span-1">
                    <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
                        <h3 className="text-sm font-semibold text-neutral-900">Quick actions</h3>

                        <div className="mt-4 grid gap-3">
                            <Link
                                href={guide.openToolHref}
                                className="inline-flex items-center justify-center rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
                            >
                                Open tool →
                            </Link>
                            <Link
                                href="/pricing"
                                className="inline-flex items-center justify-center rounded-xl border border-neutral-300 bg-white px-5 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
                            >
                                Upgrade to Pro
                            </Link>
                        </div>

                        <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />

                        <h3 className="mt-6 text-sm font-semibold text-neutral-900">
                            Related guides
                        </h3>

                        <div className="mt-3 grid gap-3">
                            {related.map(([s, g]) => (
                                <Link
                                    key={s}
                                    href={`/guides/${s}`}
                                    className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 hover:bg-neutral-100"
                                >
                                    <div className="text-sm font-semibold text-neutral-900">
                                        {g.icon} {g.title}
                                    </div>
                                    <div className="mt-1 text-xs leading-5 text-neutral-600">
                                        {g.subtitle}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </aside>
            </section>
        </main>
    );
}
