export const dynamic = "force-dynamic";
export const revalidate = 0;

import ToolShell from "@/components/ToolShell";
import ToolPageHeader from "@/components/ToolPageHeader";
import PdfToWordTool from "@/components/tools/PdfToDocTool";
import Link from "next/link";

export const metadata = {
    title: "PDF to Word Converter Online",
    description:
        "Convert PDF to editable Word (DOCX) online. Works entirely in your browser — no software downloads or installation required.",
};

export default function Page() {
    return (
        <ToolShell>
            <ToolPageHeader
                title="PDF to Word Converter"
                description="Convert PDFs to editable Word documents online. No software downloads or installation required."
            />

            {/* Trust line – Google cares about this */}
            <p className="mb-4 text-sm text-gray-600">
                Works entirely in your browser — no software downloads or installations.
            </p>

            <PdfToWordTool />

            {/* SEO-safe internal links */}
            <div className="mt-8 text-sm text-gray-600">
                Popular conversions:
                <div className="mt-2 flex flex-wrap gap-3">
                    <Link href="/pdf-to-word/pdf-to-word-online" className="underline">
                        PDF to Word Online
                    </Link>
                    <Link href="/pdf-to-word/pdf-to-docx" className="underline">
                        PDF to DOCX
                    </Link>
                    <Link href="/pdf-to-word/convert-pdf-to-word-free" className="underline">
                        Convert PDF to Word Free
                    </Link>
                </div>
            </div>
        </ToolShell>
    );
}
