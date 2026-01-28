"use client";

import dynamic from "next/dynamic";
import ToolShell from "@/components/ToolShell";
import ToolPageHeader from "@/components/ToolPageHeader";

const PdfOcrToDocxTool = dynamic(
    () => import("@/components/tools/PdfOcrToDocxTool"),
    { ssr: false }
);

export default function ClientPage() {
    return (
        <ToolShell>
            <ToolPageHeader
                title="OCR PDF to DOCX"
                description="Extract text from scanned PDFs using OCR and download as a DOCX."
            />
            <PdfOcrToDocxTool />
        </ToolShell>
    );
}
