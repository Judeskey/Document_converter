"use client";

import dynamic from "next/dynamic";

const PdfMergeTool = dynamic(() => import("@/components/tools/PdfMergeTool"), {
    ssr: false,
});

export default function EmbedPdfMergeTool() {
    return <PdfMergeTool />;
}
