import ToolShell from "@/components/ToolShell";
import ToolPageHeader from "@/components/ToolPageHeader";
import PdfOcrToDocxTool from "@/components/tools/PdfOcrToDocxTool";

export default function Page() {
    return (
        <ToolShell>
            <ToolPageHeader
                title="OCR (Scanned PDF)"
                description="Convert scanned PDFs into editable Word (DOCX)."
            />
            <PdfOcrToDocxTool />
        </ToolShell>
    );
}
