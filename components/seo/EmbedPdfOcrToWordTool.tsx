"use client";
import dynamic from "next/dynamic";

const Tool = dynamic(() => import("@/components/tools/PdfOcrToDocxTool"), {
    ssr: false,
});

export default function EmbedPdfOcrToWordTool() {
    return <Tool />;
}

