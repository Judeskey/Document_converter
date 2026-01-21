import ToolShell from "@/components/ToolShell";
import ToolPageHeader from "@/components/ToolPageHeader";
import PdfMergeTool from "@/components/tools/PdfMergeTool";

export default function Page() {
    return (
        <ToolShell>
            <ToolPageHeader
                title="PDF Merge"
                description="Upload multiple PDFs, reorder, merge, and download."
            />
            <PdfMergeTool />
        </ToolShell>
    );
}
