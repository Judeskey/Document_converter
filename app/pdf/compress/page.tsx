import ToolShell from "@/components/ToolShell";
import ToolPageHeader from "@/components/ToolPageHeader";
import PdfCompressTool from "@/components/tools/PdfCompressTool";

export default function Page() {
    return (
        <ToolShell>
            <ToolPageHeader
                title="Compress PDF"
                description="Reduce PDF size to meet upload limits."
            />
            <PdfCompressTool />
        </ToolShell>
    );
}
