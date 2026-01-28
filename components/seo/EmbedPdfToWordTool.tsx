"use client";
import dynamic from "next/dynamic";

const Tool = dynamic(() => import("@/components/tools/PdfToDocTool"), {
    ssr: false,
});

export default function EmbedPdfToWordTool() {
    return <Tool />;
}

