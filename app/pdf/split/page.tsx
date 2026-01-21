import ToolShell from "@/components/ToolShell";
import ToolPageHeader from "@/components/ToolPageHeader";
import PdfSplitTool from "@/components/tools/PdfSplitTool";

export default function Page() {
    return (
        <ToolShell>
            <ToolPageHeader
                title="PDF Split"
                description="Split by single page, range, or split into parts."
            />
            <PdfSplitTool />
        </ToolShell>
    );
}
