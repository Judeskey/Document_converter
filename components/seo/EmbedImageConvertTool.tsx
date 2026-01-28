"use client";
import dynamic from "next/dynamic";

const Tool = dynamic(() => import("@/components/tools/ImageConverterTool"), {
    ssr: false,
});

export default function EmbedImageConvertTool() {
    return <Tool />;
}

