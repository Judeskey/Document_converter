"use client";

import JSZip from "jszip";
import * as pdfjs from "pdfjs-dist";
import { useMemo, useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import ToolCard from "@/components/ToolCard";
import UploadCard from "@/components/UploadCard";

// ✅ Public worker file for Next.js
// Ensure this exists: /public/pdf.worker.min.mjs
let pdfWorkerReady = false;

async function ensurePdfWorker() {
    if (pdfWorkerReady) return;
    if (typeof window === "undefined") return;

    const workerUrl = "/pdf.worker.min.mjs";
    (pdfjs as any).GlobalWorkerOptions.workerSrc = workerUrl;

    // Verify reachable (helps avoid silent failures)
    try {
        const res = await fetch(workerUrl, { cache: "no-store" });
        if (!res.ok) throw new Error(`Worker fetch failed: ${res.status} ${res.statusText}`);
    } catch (e) {
        // If the worker fetch fails, PDF.js can behave unpredictably.
        // We surface a clear error for the user.
        throw new Error(
            "PDF worker is not reachable. Make sure /public/pdf.worker.min.mjs exists and is deployed."
        );
    }

    pdfWorkerReady = true;
}

const MAX_ALL_PAGES = 50;

export default function PdfToImageTool() {
    const [p2iFile, setP2iFile] = useState<File | null>(null);
    const [p2iTotalPages, setP2iTotalPages] = useState<number | null>(null);

    const [p2iMode, setP2iMode] = useState<"first" | "all">("first");
    const [p2iOut, setP2iOut] = useState<"png" | "jpg">("png");
    const [p2iDpi, setP2iDpi] = useState("200");

    const [p2iBusy, setP2iBusy] = useState(false);
    const [p2iMsg, setP2iMsg] = useState("");

    const fileLabel = useMemo(() => {
        if (!p2iFile) return "No PDF selected";
        const kb = Math.round(p2iFile.size / 1024);
        const pages = p2iTotalPages ?? "—";
        return `${p2iFile.name} (${kb} KB) • Total pages: ${pages}`;
    }, [p2iFile, p2iTotalPages]);

    // UploadCard may pass File | File[] | FileList | input event
    const pickFirstFile = useCallback((input: any): File | null => {
        if (!input) return null;

        if (Array.isArray(input)) return input[0] ?? null;
        if (typeof File !== "undefined" && input instanceof File) return input;

        if (typeof FileList !== "undefined" && input instanceof FileList) return input[0] ?? null;

        const maybeFiles = input?.target?.files;
        if (maybeFiles && typeof FileList !== "undefined" && maybeFiles instanceof FileList) {
            return maybeFiles[0] ?? null;
        }

        if (Array.isArray(input?.files)) return input.files[0] ?? null;

        return null;
    }, []);

    async function onPickPdfToImage(f: File | null) {
        setP2iFile(f);
        setP2iMsg("");
        setP2iTotalPages(null);
        setP2iMode("first");

        if (!f) return;

        try {
            const bytes = await f.arrayBuffer();
            const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
            setP2iTotalPages(doc.getPageCount());
        } catch {
            setP2iMsg("Could not read the PDF page count (file may be corrupted or locked).");
        }
    }

    const onUploadPick = useCallback(
        (input: any) => {
            const f = pickFirstFile(input);
            onPickPdfToImage(f);
        },
        [pickFirstFile]
    );

    async function convertPdfToImageClient() {
        setP2iMsg("");

        if (!p2iFile) {
            setP2iMsg("Please choose a PDF first.");
            return;
        }

        const dpiNum = parseInt(p2iDpi || "200", 10);
        if (!Number.isFinite(dpiNum) || dpiNum < 72 || dpiNum > 300) {
            setP2iMsg("DPI must be between 72 and 300.");
            return;
        }

        setP2iBusy(true);
        try {
            await ensurePdfWorker();

            const bytes = new Uint8Array(await p2iFile.arrayBuffer());
            const doc = await (pdfjs as any)
                .getDocument({
                    data: bytes,
                    disableAutoFetch: true,
                    disableStream: true,
                    stopAtErrors: false,
                })
                .promise;

            const total = doc.numPages as number;

            // ✅ MVP guardrail
            if (p2iMode === "all" && total > MAX_ALL_PAGES) {
                setP2iMsg(
                    `This PDF has ${total} pages. For MVP we limit “All pages” to ${MAX_ALL_PAGES} pages to avoid slow downloads/crashes. Use “First page only” or split the PDF first.`
                );
                return;
            }

            const base = (p2iFile.name || "document").replace(/\.pdf$/i, "");
            const scale = dpiNum / 72;

            const renderPage = async (pageNum: number) => {
                const page = await doc.getPage(pageNum);
                const viewport = page.getViewport({ scale });

                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                if (!ctx) throw new Error("Canvas not available.");

                canvas.width = Math.ceil(viewport.width);
                canvas.height = Math.ceil(viewport.height);

                // White background for JPG + consistent output
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                await page.render({ canvasContext: ctx, viewport }).promise;

                const mime = p2iOut === "png" ? "image/png" : "image/jpeg";
                const quality = p2iOut === "jpg" ? 0.85 : undefined;

                const blob: Blob = await new Promise((resolve, reject) => {
                    canvas.toBlob(
                        (b) => (b ? resolve(b) : reject(new Error("Failed to create image."))),
                        mime,
                        quality as any
                    );
                });

                return blob;
            };

            // First page -> single image
            if (p2iMode === "first") {
                const blob = await renderPage(1);
                const ext = p2iOut === "png" ? "png" : "jpg";
                const filename = `${base}_page_1.${ext}`;

                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);

                setP2iMsg("Done ✅ Image download started.");
                return;
            }

            // All pages -> ZIP
            const zip = new JSZip();
            const ext = p2iOut === "png" ? "png" : "jpg";

            for (let p = 1; p <= total; p++) {
                setP2iMsg(`Rendering page ${p} of ${total}...`);
                const blob = await renderPage(p);
                const buf = await blob.arrayBuffer();
                zip.file(`${base}_page_${p}.${ext}`, buf);
            }

            setP2iMsg("Creating ZIP...");
            const zipBlob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });

            const zipName = `${base}_images_${total}_pages.zip`;
            const url = URL.createObjectURL(zipBlob);
            const a = document.createElement("a");
            a.href = url;
            a.download = zipName;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);

            setP2iMsg(`Done ✅ ZIP download started (${total} files).`);
        } catch (e: any) {
            setP2iMsg(e?.message || "PDF → Image error.");
        } finally {
            setP2iBusy(false);
        }
    }

    return (
        <ToolCard
            title="PDF → Image"
            subtitle="Convert PDF pages into PNG/JPG. First page = single file, All pages = ZIP."
            badge="High value"
            gradient="from-indigo-500 to-violet-500"
            icon="🧾"
        >
            <div className="grid gap-4">
                <UploadCard
                    title="Upload a PDF"
                    subtitle="Drag & drop a PDF here, or click to choose."
                    accept="application/pdf,.pdf"
                    disabled={p2iBusy}
                    valueLabel={fileLabel}
                    onPick={onUploadPick}
                    onClear={() => onPickPdfToImage(null)}
                />

                <div className="rounded-2xl border bg-white p-5">
                    <div className="grid gap-3 sm:grid-cols-3">
                        <div>
                            <label className="text-sm font-semibold text-gray-900">Pages</label>
                            <select
                                className="mt-2 w-full rounded-xl border px-3 py-2 text-sm"
                                value={p2iMode}
                                onChange={(e) => setP2iMode(e.target.value as "first" | "all")}
                                disabled={p2iBusy}
                            >
                                <option value="first">First page only</option>
                                <option value="all">All pages (ZIP)</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-900">Output</label>
                            <select
                                className="mt-2 w-full rounded-xl border px-3 py-2 text-sm"
                                value={p2iOut}
                                onChange={(e) => setP2iOut(e.target.value as "png" | "jpg")}
                                disabled={p2iBusy}
                            >
                                <option value="png">PNG</option>
                                <option value="jpg">JPG</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-900">Quality (DPI)</label>
                            <input
                                className="mt-2 w-full rounded-xl border px-3 py-2 text-sm"
                                value={p2iDpi}
                                onChange={(e) => setP2iDpi(e.target.value)}
                                inputMode="numeric"
                                placeholder="200"
                                disabled={p2iBusy}
                            />
                            <div className="mt-1 text-xs text-gray-600">72–300 recommended</div>
                        </div>
                    </div>

                    <button
                        className="mt-4 w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white hover:bg-black disabled:opacity-50"
                        onClick={convertPdfToImageClient}
                        disabled={p2iBusy}
                    >
                        {p2iBusy
                            ? "Converting..."
                            : p2iMode === "all"
                                ? "Convert All Pages & Download ZIP"
                                : "Convert First Page & Download"}
                    </button>

                    {p2iMsg ? <div className="mt-3 text-sm text-gray-700">{p2iMsg}</div> : null}
                </div>
            </div>
        </ToolCard>
    );
}
