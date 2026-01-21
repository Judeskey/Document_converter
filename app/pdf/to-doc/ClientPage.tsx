"use client";

import dynamic from "next/dynamic";
import ToolShell from "@/components/ToolShell";
import ToolPageHeader from "@/components/ToolPageHeader";

const PdfToDocTool = dynamic(() => import("@/components/tools/PdfToDocTool"), {
    ssr: false,
});

export default function ClientPage() {
    return (
        <ToolShell>
            <ToolPageHeader
                title="PDF to Word"
                description="Convert text-based PDFs into a DOCX file."
            />
            <PdfToDocTool />
        </ToolShell>
    );
}
