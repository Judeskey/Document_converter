"use client";

import { PDFDocument } from "pdf-lib";

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

// ---- pdf.js lazy loader (prevents Node/prerender crashes) ----
let _pdfjs: any = null;
let _workerReady = false;

async function getPdfjs() {
    if (typeof window === "undefined") {
        // If this ever gets called on server, hard stop (should not happen after fix #2).
        throw new Error("pdf.js can only run in the browser.");
    }
    if (_pdfjs) return _pdfjs;
    const mod = await import("pdfjs-dist");
    _pdfjs = mod;
    return _pdfjs;
}

async function ensurePdfWorker() {
    if (_workerReady) return;
    const pdfjsLib = await getPdfjs();

    const workerUrl = "/pdf.worker.min.mjs";
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

    // Verify reachable so failure is obvious
    const res = await fetch(workerUrl, { cache: "no-store" });
    if (!res.ok) {
        throw new Error(`PDF worker fetch failed: ${res.status} ${res.statusText}`);
    }

    _workerReady = true;
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

        const safe = new Uint8Array(outBytes);
        return new Blob([safe], { type: "application/pdf" });
    }

    // --- MODE 2: Strong compression (renders pages -> JPEG -> rebuilds PDF) ---
    await ensurePdfWorker();
    const pdfjsLib = await getPdfjs();

    const preset = opts.strongPreset ?? "balanced";
    const { dpi, quality } = presetToSettings(preset);

    const loadingTask = pdfjsLib.getDocument({
        data: inputBytes,
        disableAutoFetch: true,
        disableStream: true,
        stopAtErrors: false,
    });

    const pdf = await loadingTask.promise;

    const total = pdf.numPages as number;
    const maxPages = opts.maxPagesStrong ?? 50;

    if (total > maxPages) {
        throw new Error(`Strong compression supports up to ${maxPages} pages (this file has ${total}).`);
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

        await page.render({ canvasContext: ctx, viewport, intent: "display" }).promise;

        const jpgBytes = await canvasToJpegBytes(canvas, quality);
        const jpg = await outPdf.embedJpg(jpgBytes);

        const widthPts = canvas.width / scale;
        const heightPts = canvas.height / scale;

        const outPage = outPdf.addPage([widthPts, heightPts]);
        outPage.drawImage(jpg, { x: 0, y: 0, width: widthPts, height: heightPts });

        canvas.width = 1;
        canvas.height = 1;
    }

    onProgress?.({ page: total, total, stage: "Finalizing PDF…" });

    const outBytes = await outPdf.save({ useObjectStreams: true });
    const safe = new Uint8Array(outBytes);
    return new Blob([safe], { type: "application/pdf" });
}
