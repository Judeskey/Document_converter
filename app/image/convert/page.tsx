import ToolShell from "@/components/ToolShell";
import ToolPageHeader from "@/components/ToolPageHeader";
import ImageConverterTool from "@/components/tools/ImageConverterTool";

export default function Page() {
    return (
        <ToolShell>
            <ToolPageHeader
                title="Image Converter"
                description="Convert images between PNG, JPG, WebP, and AVIF."
            />
            <ImageConverterTool />
        </ToolShell>
    );
}
