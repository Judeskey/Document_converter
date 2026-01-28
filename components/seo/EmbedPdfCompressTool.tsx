"use client";
import dynamic from "next/dynamic";

const Tool = dynamic(() => import("@/components/tools/PdfCompressTool"), {
    ssr: false,
});

export default function EmbedPdfCompressTool() {
    return <Tool />;
}
