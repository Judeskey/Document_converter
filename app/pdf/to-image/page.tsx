import ToolShell from "@/components/ToolShell";
import ToolPageHeader from "@/components/ToolPageHeader";
import PdfToImageTool from "@/components/tools/PdfToImageTool";

export default function Page() {
    return (
        <ToolShell>
            <ToolPageHeader
                title="PDF to Image"
                description="Convert PDF pages to PNG/JPG (ZIP for multiple pages)."
            />
            <PdfToImageTool />
        </ToolShell>
    );
}
