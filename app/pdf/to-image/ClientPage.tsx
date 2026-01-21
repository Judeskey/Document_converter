"use client";

import dynamic from "next/dynamic";
import ToolShell from "@/components/ToolShell";
import ToolPageHeader from "@/components/ToolPageHeader";

const PdfToImageTool = dynamic(
    () => import("@/components/tools/PdfToImageTool"),
    { ssr: false }
);

export default function ClientPage() {
    return (
        <ToolShell>
            <ToolPageHeader
                title="PDF to Image"
                description="Convert PDF pages into images (PNG/JPG) in your browser."
            />
            <PdfToImageTool />
        </ToolShell>
    );
}
