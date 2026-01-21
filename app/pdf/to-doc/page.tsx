import ToolShell from "@/components/ToolShell";
import ToolPageHeader from "@/components/ToolPageHeader";
import PdfToDocTool from "@/components/tools/PdfToDocTool";

export default function Page() {
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
