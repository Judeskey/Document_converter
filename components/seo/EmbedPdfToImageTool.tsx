"use client";
import dynamic from "next/dynamic";

const Tool = dynamic(() => import("@/components/tools/PdfToImageTool"), {
    ssr: false,
});

export default function EmbedPdfToImageTool() {
    return <Tool />;
}
