export const dynamic = "force-dynamic";
export const revalidate = 0;

import ClientPage from "./ClientPage";

export const metadata = {
    title: "OCR PDF Online Free",
    description:
        "Extract text from scanned PDFs using OCR. Turn scanned documents into searchable, editable content online.",
};

export default function Page() {
    return (
        <>
            {/* Main tool UI */}
            <ClientPage />

            {/* SEO: Internal links to programmatic pages */}
            <section className="mx-auto mt-12 max-w-5xl px-4">
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                    <h2 className="text-sm font-semibold text-neutral-900">
                        Popular searches
                    </h2>

                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                        <a
                            href="/pdf-ocr-to-word/ocr-pdf-to-word"
                            className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-600"
                        >
                            OCR PDF to Word
                        </a>

                        <a
                            href="/pdf-ocr-to-word/scan-pdf-to-word"
                            className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-600"
                        >
                            Convert Scanned PDF to Word
                        </a>

                        <a
                            href="/pdf-ocr-to-word/pdf-ocr-to-docx"
                            className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-600"
                        >
                            PDF OCR to DOCX
                        </a>

                        <a
                            href="/pdf-ocr-to-word/convert-scanned-pdf-to-word"
                            className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-600"
                        >
                            Convert Scanned PDF to Word Online
                        </a>

                        <a
                            href="/pdf-ocr-to-word/extract-text-from-scanned-pdf"
                            className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-600"
                        >
                            Extract Text from Scanned PDF
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
}
