"use client";

import dynamic from "next/dynamic";

// ✅ Client-only: prevents SSR/prerender from touching pdf.js
const PdfCompressTool = dynamic(
    () => import("@/components/tools/PdfCompressTool"),
    { ssr: false }
);

export default function ClientOnly() {
    return <PdfCompressTool />;
}
