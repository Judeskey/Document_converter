"use client";

import { PDFDocument } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

/**
 * IMPORTANT:
 * If you already set pdfjs workerSrc in your existing PDF→Image feature,
 * then REMOVE this block here and reuse your existing setup.
 */
(pdfjsLib as any).GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/legacy/build/pdf.worker.mjs",
    import.meta.url
).toString();


export type CompressMode = "lossless" | "strong";
export type StrongPreset = "balanced" | "smallest" | "best";

export type CompressOptions = {
    mode: CompressMode;
    strongPreset?: StrongPreset;
    maxPagesStrong?: number; // guardrail
};

function presetToSettings(preset: StrongPreset) {
    if (preset === "smallest") return { dpi: 96, quality: 0.55 };
    if (preset === "best") return { dpi: 180, quality: 0.85 };
    return { dpi: 144, quality: 0.7 }; // balanced
}

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
}

async function canvasToJpegBytes(canvas: HTMLCanvasElement, quality: number) {
    const q = clamp(quality, 0.35, 0.92);
    return new Promise<Uint8Array>((resolve, reject) => {
        canvas.toBlob(
            async (blob) => {
                if (!blob) return reject(new Error("Failed to encode image."));
                resolve(new Uint8Array(await blob.arrayBuffer()));
            },
            "image/jpeg",
            q
        );
    });
}

export async function compressPdfClient(
    file: File,
    opts: CompressOptions,
    onProgress?: (p: { page: number; total: number; stage: string }) => void
): Promise<Blob> {
    const inputBytes = new Uint8Array(await file.arrayBuffer());

    // --- MODE 1: Lossless-ish optimize (keeps text selectable) ---
    if (opts.mode === "lossless") {
        onProgress?.({ page: 0, total: 0, stage: "Optimizing PDF…" });

        const pdfDoc = await PDFDocument.load(inputBytes, { ignoreEncryption: true });
        const outBytes = await pdfDoc.save({
            useObjectStreams: true,
            addDefaultPage: false,
            updateFieldAppearances: false,
        });

        return new Blob([outBytes], { type: "application/pdf" });
    }

    // --- MODE 2: Strong compression (renders pages -> JPEG -> rebuilds PDF) ---
    const preset = opts.strongPreset ?? "balanced";
    const { dpi, quality } = presetToSettings(preset);

    const loadingTask = pdfjsLib.getDocument({ data: inputBytes });
    const pdf = await loadingTask.promise;

    const total = pdf.numPages;
    const maxPages = opts.maxPagesStrong ?? 50;

    if (total > maxPages) {
        throw new Error(
            `Strong compression supports up to ${maxPages} pages (this file has ${total}).`
        );
    }

    const outPdf = await PDFDocument.create();
    const scale = dpi / 72;

    for (let i = 1; i <= total; i++) {
        onProgress?.({ page: i, total, stage: "Rendering & compressing pages…" });

        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { alpha: false });
        if (!ctx) throw new Error("Canvas 2D context not available.");

        canvas.width = Math.max(1, Math.floor(viewport.width));
        canvas.height = Math.max(1, Math.floor(viewport.height));

        const renderTask = page.render({
            canvasContext: ctx,
            viewport,
            intent: "display",
        });

        await renderTask.promise;

        const jpgBytes = await canvasToJpegBytes(canvas, quality);
        const jpg = await outPdf.embedJpg(jpgBytes);

        const widthPts = canvas.width / scale;
        const heightPts = canvas.height / scale;

        const outPage = outPdf.addPage([widthPts, heightPts]);
        outPage.drawImage(jpg, { x: 0, y: 0, width: widthPts, height: heightPts });

        // Free memory
        canvas.width = 1;
        canvas.height = 1;
    }

    onProgress?.({ page: total, total, stage: "Finalizing PDF…" });

    const outBytes = await outPdf.save({ useObjectStreams: true });
    return new Blob([outBytes], { type: "application/pdf" });
}
