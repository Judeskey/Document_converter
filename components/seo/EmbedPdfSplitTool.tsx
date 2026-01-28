"use client";
import dynamic from "next/dynamic";

const Tool = dynamic(() => import("@/components/tools/PdfSplitTool"), {
    ssr: false,
});

export default function EmbedPdfSplitTool() {
    return <Tool />;
}
