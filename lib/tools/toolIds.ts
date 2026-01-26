// lib/tools/toolIds.ts

export const TOOL_IDS = {
    imageConverter: "image-converter",
    pdfCompress: "pdf-compress",
    pdfMerge: "pdf-merge",
    pdfSplit: "pdf-split",
    pdfToDoc: "pdf-to-doc",
    pdfToImage: "pdf-to-image",
    pdfOcrToDocx: "pdf-ocr-to-docx",
} as const;

export type ToolId = (typeof TOOL_IDS)[keyof typeof TOOL_IDS];
