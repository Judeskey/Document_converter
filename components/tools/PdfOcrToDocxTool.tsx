"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { saveAs } from "file-saver";
import ToolCard from "@/components/ToolCard";
import UploadCard from "@/components/UploadCard";

type Mode = "first" | "range" | "all";

type UsageJson = {
    tool: string;
    freeUsed: boolean;
    freeRemaining: number;
};

const LANGS = [
    { code: "eng", label: "English" },
    { code: "fra", label: "French" },
    { code: "spa", label: "Spanish" },
];

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
}

function cleanText(s: string) {
    return s
        .replace(/\r/g, "")
        .replace(/[ \t]+\n/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}

function isMostlyUppercase(s: string) {
    const letters = s.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ]/g, "");
    if (letters.length < 6) return false;
    const upper = letters.replace(/[^A-ZÀ-ÖØ-Þ]/g, "").length;
    return upper / letters.length >= 0.75;
}

function looksLikeHeading(line: string) {
    const t = line.trim();
    if (!t) return false;
    if (t.length <= 60 && (isMostlyUppercase(t) || /:\s*$/.test(t))) return true;
    return false;
}

/**
 * Build paragraphs from OCR "lines" using vertical gap clustering.
 */
function linesToParagraphs(lines: any[]) {
    if (!lines?.length) return [];

    const cleaned = lines
        .map((l) => ({
            text: cleanText(String(l.text || "")),
            y0: l.bbox?.y0 ?? 0,
            y1: l.bbox?.y1 ?? 0,
        }))
        .filter((l) => l.text.length > 0);

    if (!cleaned.length) return [];

    cleaned.sort((a, b) => a.y0 - b.y0);

    const paras: string[] = [];
    let buf: string[] = [];
    let prevY1 = cleaned[0].y1;

    const heights = cleaned
        .slice(0, Math.min(10, cleaned.length))
        .map((l) => Math.abs(l.y1 - l.y0) || 10);
    const medH =
        heights.sort((a, b) => a - b)[Math.floor(heights.length / 2)] || 12;

    const GAP_THRESHOLD = medH * 0.9;

    for (const ln of cleaned) {
        const gap = ln.y0 - prevY1;

        if (buf.length && gap > GAP_THRESHOLD) {
            paras.push(buf.join(" ").trim());
            buf = [];
        }

        buf.push(ln.text);
        prevY1 = ln.y1;
    }

    if (buf.length) paras.push(buf.join(" ").trim());
    return paras;
}

/**
 * Next.js-friendly PDF.js worker setup.
 * Put the worker file in /public/pdf.worker.min.mjs and use that URL here.
 */
let pdfWorkerReady = false;

async function ensurePdfWorker() {
    if (pdfWorkerReady) return;
    if (typeof window === "undefined") return;

    const workerUrl = "/pdf.worker.min.mjs"; // must match public file name
    (pdfjs as any).GlobalWorkerOptions.workerSrc = workerUrl;

    try {
        const res = await fetch(workerUrl, { cache: "no-store" });
        if (!res.ok) {
            throw new Error(`Worker fetch failed: ${res.status} ${res.statusText}`);
        }
    } catch (err) {
        console.error("PDF worker not reachable:", err);
        return;
    }

    pdfWorkerReady = true;
}

/**
 * Accept whatever UploadCard sends: File | File[] | FileList | input event.
 */
function pickFirstFile(input: any): File | null {
    if (!input) return null;

    if (Array.isArray(input)) return input[0] ?? null;
    if (typeof File !== "undefined" && input instanceof File) return input;

    if (typeof FileList !== "undefined" && input instanceof FileList)
        return input[0] ?? null;

    const maybeFiles = input?.target?.files;
    if (maybeFiles && typeof FileList !== "undefined" && maybeFiles instanceof FileList) {
        return maybeFiles[0] ?? null;
    }

    if (Array.isArray(input?.files)) return input.files[0] ?? null;

    return null;
}

async function loadPdfDocument(bytes: Uint8Array) {
    try {
        return await (pdfjs as any)
            .getDocument({
                data: bytes,
                disableAutoFetch: true,
                disableStream: true,
                stopAtErrors: false,
            })
            .promise;
    } catch (err1: any) {
        console.error("pdf.js getDocument failed (worker mode):", err1);

        try {
            return await (pdfjs as any)
                .getDocument({
                    data: bytes,
                    disableWorker: true,
                    disableAutoFetch: true,
                    disableStream: true,
                    stopAtErrors: false,
                })
                .promise;
        } catch (err2: any) {
            console.error("pdf.js getDocument failed (no-worker mode):", err2);
            const m1 = err1?.message || String(err1);
            const m2 = err2?.message || String(err2);
            throw new Error(`PDF read failed. Worker: ${m1} | No-worker: ${m2}`);
        }
    }
}

export default function PdfOcrToDocxTool() {
    const [file, setFile] = useState<File | null>(null);
    const [totalPages, setTotalPages] = useState<number | null>(null);

    const [mode, setMode] = useState<Mode>("first");
    const [start, setStart] = useState("1");
    const [end, setEnd] = useState("1");

    const [lang, setLang] = useState("eng");
    const [dpi, setDpi] = useState("200");

    const [busy, setBusy] = useState(false);
    const [msg, setMsg] = useState("");
    const [warn, setWarn] = useState("");

    const [pageProgress, setPageProgress] = useState(0);
    const [overallProgress, setOverallProgress] = useState(0);

    // Usage UI
    const [freeUsed, setFreeUsed] = useState(false);
    const [freeRemaining, setFreeRemaining] = useState(0);

    // Per-tool id
    const TOOL_ID = "pdf-ocr-to-docx";
    const isDev = process.env.NODE_ENV !== "production";

    async function getUsage(): Promise<UsageJson> {
        const res = await fetch(`/api/usage/${TOOL_ID}`, {
            method: "GET",
            credentials: "include",
            headers: { Accept: "application/json" },
            cache: "no-store",
        });

        if (!res.ok) {
            const text = await res.text().catch(() => "");
            throw new Error(text || `Usage check failed (${res.status})`);
        }

        return (await res.json()) as UsageJson;
    }

    async function burnUsage(): Promise<void> {
        const res = await fetch(`/api/usage/${TOOL_ID}`, {
            method: "POST",
            credentials: "include",
            headers: { Accept: "application/json" },
        });

        if (!res.ok) {
            const text = await res.text().catch(() => "");
            throw new Error(text || `Usage burn failed (${res.status})`);
        }
    }

    async function refreshUsageUI() {
        try {
            const j = await getUsage();
            setFreeUsed(Boolean(j.freeUsed));
            setFreeRemaining(Number(j.freeRemaining ?? 0));
        } catch {
            // ignore
        }
    }

    useEffect(() => {
        refreshUsageUI();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // MVP guardrails
    const MAX_ALL_PAGES = 10;
    const MAX_RANGE_PAGES = 20;
    const MIN_DPI = 120;
    const MAX_DPI = 250;

    const pagesSelected = useMemo(() => {
        const t = totalPages ?? 0;
        if (!t) return 0;
        if (mode === "first") return 1;

        const s = clamp(parseInt(start || "1", 10) || 1, 1, t);
        const e = clamp(parseInt(end || "1", 10) || 1, 1, t);
        return mode === "all" ? t : Math.max(1, Math.abs(e - s) + 1);
    }, [mode, start, end, totalPages]);

    const fileLabel = useMemo(() => {
        if (!file) return "No PDF selected";
        const kb = Math.round(file.size / 1024);
        return `${file.name} (${kb} KB)${totalPages ? ` • ${totalPages} pages` : ""}`;
    }, [file, totalPages]);

    async function onPickPdf(f: File | null) {
        setFile(f);
        setMsg("");
        setWarn("");
        setTotalPages(null);
        setMode("first");
        setStart("1");
        setEnd("1");
        setPageProgress(0);
        setOverallProgress(0);

        if (!f) return;

        try {
            await ensurePdfWorker();
            const bytes = new Uint8Array(await f.arrayBuffer());
            const doc = await loadPdfDocument(bytes);

            const t = doc.numPages as number;
            setTotalPages(t);
            setStart("1");
            setEnd(String(t));
        } catch (err: any) {
            console.error("onPickPdf() failed:", err);
            setWarn(err?.message || String(err) || "Could not read this PDF.");
        }
    }

    const onUploadPick = useCallback((input: any) => {
        const f = pickFirstFile(input);
        onPickPdf(f);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function resetDevOnly() {
        if (!isDev) return;
        setMsg("");
        setWarn("");
        setBusy(true);
        try {
            const res = await fetch(`/api/usage/${TOOL_ID}/reset`, {
                method: "POST",
                credentials: "include",
                headers: { Accept: "application/json" },
            });

            if (!res.ok) {
                const text = await res.text().catch(() => "");
                throw new Error(text || `Reset failed (${res.status})`);
            }

            await refreshUsageUI();
            setMsg("Reset done (dev only).");
        } catch (e: any) {
            setWarn(e?.message || "Reset failed.");
        } finally {
            setBusy(false);
        }
    }

    async function runOcr() {
        setMsg("");
        setWarn("");
        setPageProgress(0);
        setOverallProgress(0);

        if (!file || !totalPages) {
            setMsg("Please choose a PDF first.");
            return;
        }

        // ✅ Preflight usage check (block early)
        try {
            setMsg("Checking free usage...");
            const usage = await getUsage();
            setFreeUsed(Boolean(usage.freeUsed));
            setFreeRemaining(Number(usage.freeRemaining ?? 0));

            if (usage.freeRemaining <= 0) {
                setMsg("Free usage limit reached. Please upgrade to continue using OCR PDF → DOCX.");
                return;
            }
        } catch (e: any) {
            setMsg(e?.message || "Unable to check usage right now.");
            return;
        }

        const dpiNum = parseInt(dpi || "200", 10);
        if (!Number.isFinite(dpiNum) || dpiNum < MIN_DPI || dpiNum > MAX_DPI) {
            setMsg(`DPI must be between ${MIN_DPI} and ${MAX_DPI}.`);
            return;
        }

        let s = 1;
        let e = 1;

        if (mode === "first") {
            s = 1;
            e = 1;
        } else if (mode === "all") {
            s = 1;
            e = totalPages;
            if (totalPages > MAX_ALL_PAGES) {
                setWarn(
                    `For MVP, “All pages” OCR is limited to ${MAX_ALL_PAGES} pages. Use “Page range” or split first.`
                );
                return;
            }
        } else {
            s = clamp(parseInt(start || "1", 10) || 1, 1, totalPages);
            e = clamp(parseInt(end || "1", 10) || 1, 1, totalPages);
            if (e < s) [s, e] = [e, s];

            const count = e - s + 1;
            if (count > MAX_RANGE_PAGES) {
                setWarn(
                    `For MVP, OCR range is limited to ${MAX_RANGE_PAGES} pages. You selected ${count}. Split first or reduce the range.`
                );
                return;
            }
        }

        const totalToProcess = e - s + 1;

        setBusy(true);
        try {
            await ensurePdfWorker();

            const Tesseract = (await import("tesseract.js")).default;

            const bytes = new Uint8Array(await file.arrayBuffer());
            const pdf = await loadPdfDocument(bytes);

            setMsg("Starting OCR engine...");
            const worker = await Tesseract.createWorker(lang);

            if (worker.setParameters) {
                await worker.setParameters({ tessedit_pageseg_mode: "1" });
            }

            const scale = dpiNum / 72;
            const extractedPerPage: { page: number; paragraphs: string[] }[] = [];

            for (let pageNum = s; pageNum <= e; pageNum++) {
                const idx = pageNum - s;

                setPageProgress(5);
                setMsg(`Rendering page ${pageNum} of ${e}...`);

                const page = await pdf.getPage(pageNum);
                const viewport = page.getViewport({ scale });

                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                if (!ctx) throw new Error("Canvas not available.");

                canvas.width = Math.ceil(viewport.width);
                canvas.height = Math.ceil(viewport.height);

                ctx.fillStyle = "#ffffff";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                await page.render({ canvasContext: ctx, viewport }).promise;

                setPageProgress(25);
                setMsg(`OCR page ${pageNum} of ${e}...`);

                const result = await worker.recognize(canvas);

                setPageProgress(95);

                const paras = linesToParagraphs(result?.data?.lines || []);
                const fallback = cleanText(result?.data?.text || "");
                const finalParas = paras.length ? paras : fallback ? fallback.split("\n\n") : [];

                extractedPerPage.push({
                    page: pageNum,
                    paragraphs: finalParas.map((p) => p.trim()).filter(Boolean),
                });

                const overall = Math.round(((idx + 1) / totalToProcess) * 100);
                setOverallProgress(overall);
                setPageProgress(100);
            }

            setMsg("Finalizing DOCX...");
            await worker.terminate();

            const children: Paragraph[] = [];

            children.push(
                new Paragraph({
                    children: [new TextRun({ text: `OCR Converted: ${file.name}`, bold: true })],
                    spacing: { after: 240 },
                })
            );

            extractedPerPage.forEach((pg, i) => {
                if (i > 0) {
                    children.push(
                        new Paragraph({
                            children: [new TextRun("")],
                            pageBreakBefore: true,
                        })
                    );
                }

                children.push(
                    new Paragraph({
                        children: [new TextRun({ text: `Page ${pg.page}`, italics: true })],
                        spacing: { after: 120 },
                    })
                );

                for (const para of pg.paragraphs) {
                    const t = para.trim();

                    if (looksLikeHeading(t)) {
                        children.push(
                            new Paragraph({
                                heading: HeadingLevel.HEADING_2,
                                children: [new TextRun({ text: t.replace(/:\s*$/, "") })],
                                spacing: { after: 160 },
                            })
                        );
                        continue;
                    }

                    children.push(new Paragraph(t));
                }
            });

            const docx = new Document({
                sections: [{ properties: {}, children }],
            });

            const blob = await Packer.toBlob(docx);
            const base = (file.name || "document").replace(/\.pdf$/i, "");
            const outName = `${base}_OCR_${lang}.docx`;
            saveAs(blob, outName);

            // ✅ Burn usage ONLY after success (don’t block download if burn fails)
            try {
                await burnUsage();
            } catch (burnErr) {
                console.error("Usage burn failed:", burnErr);
            }
            await refreshUsageUI();

            setMsg(`Done ✅ Download started: ${outName}`);
            setPageProgress(100);
            setOverallProgress(100);
        } catch (e: any) {
            setMsg(e?.message || "OCR failed.");
        } finally {
            setBusy(false);
        }
    }

    return (
        <ToolCard
            title="OCR PDF → DOCX"
            subtitle="Best for scanned PDFs. Supports English/French/Spanish + progress + improved formatting."
        >
            <div className="space-y-4">
                <UploadCard
                    title="Upload a PDF"
                    subtitle="Drag & drop a PDF here, or click to choose"
                    accept="application/pdf,.pdf"
                    disabled={busy}
                    valueLabel={fileLabel}
                    onPick={onUploadPick}
                    onClear={() => onPickPdf(null)}
                />

                <div className="rounded-xl border bg-white p-4">
                    {/* Usage panel */}
                    <div className="mb-4 rounded-xl border bg-gray-50 p-3 text-sm text-gray-800">
                        <div className="font-semibold">Usage (this tool)</div>
                        <div className="mt-1 text-xs text-gray-700">
                            Free used: <span className="font-semibold">{freeUsed ? "Yes" : "No"}</span> • Free remaining:{" "}
                            <span className="font-semibold">{freeRemaining}</span>
                        </div>
                        {isDev ? (
                            <button
                                className="mt-2 inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold
                           bg-gray-900 text-white hover:bg-black disabled:opacity-50"
                                disabled={busy}
                                onClick={resetDevOnly}
                            >
                                Reset (dev only)
                            </button>
                        ) : null}
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                        <div>
                            <label className="text-sm font-semibold">Pages</label>
                            <select
                                className="mt-2 w-full rounded-xl border bg-white px-3 py-2 text-sm"
                                value={mode}
                                onChange={(e) => setMode(e.target.value as Mode)}
                                disabled={busy}
                            >
                                <option value="first">First page only</option>
                                <option value="range">Page range</option>
                                <option value="all">All pages (limit)</option>
                            </select>
                            <div className="mt-1 text-xs text-gray-600">Selected: {pagesSelected || "—"} page(s)</div>
                        </div>

                        <div>
                            <label className="text-sm font-semibold">Language</label>
                            <select
                                className="mt-2 w-full rounded-xl border bg-white px-3 py-2 text-sm"
                                value={lang}
                                onChange={(e) => setLang(e.target.value)}
                                disabled={busy}
                            >
                                {LANGS.map((l) => (
                                    <option key={l.code} value={l.code}>
                                        {l.label}
                                    </option>
                                ))}
                            </select>
                            <div className="mt-1 text-xs text-gray-600">More languages can be added later.</div>
                        </div>

                        <div>
                            <label className="text-sm font-semibold">Quality (DPI)</label>
                            <input
                                className="mt-2 w-full rounded-xl border bg-white px-3 py-2 text-sm"
                                value={dpi}
                                onChange={(e) => setDpi(e.target.value)}
                                inputMode="numeric"
                                disabled={busy}
                            />
                            <div className="mt-1 text-xs text-gray-600">
                                {MIN_DPI}–{MAX_DPI} recommended
                            </div>
                        </div>
                    </div>

                    {mode === "range" ? (
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            <div>
                                <label className="text-sm font-semibold">Start</label>
                                <input
                                    className="mt-2 w-full rounded-xl border bg-white px-3 py-2 text-sm"
                                    value={start}
                                    onChange={(e) => setStart(e.target.value)}
                                    inputMode="numeric"
                                    disabled={busy}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold">End</label>
                                <input
                                    className="mt-2 w-full rounded-xl border bg-white px-3 py-2 text-sm"
                                    value={end}
                                    onChange={(e) => setEnd(e.target.value)}
                                    inputMode="numeric"
                                    disabled={busy}
                                />
                            </div>
                        </div>
                    ) : null}

                    {busy ? (
                        <div className="mt-4 rounded-xl border bg-gray-50 p-3 text-sm">
                            <div className="flex items-center justify-between">
                                <div className="font-semibold">Overall progress</div>
                                <div>{overallProgress}%</div>
                            </div>
                            <div className="mt-2 h-2 w-full rounded bg-gray-200">
                                <div className="h-2 rounded bg-gray-900" style={{ width: `${overallProgress}%` }} />
                            </div>

                            <div className="mt-3 flex items-center justify-between">
                                <div className="font-semibold">Current page</div>
                                <div>{pageProgress}%</div>
                            </div>
                            <div className="mt-2 h-2 w-full rounded bg-gray-200">
                                <div className="h-2 rounded bg-gray-900" style={{ width: `${pageProgress}%` }} />
                            </div>
                        </div>
                    ) : null}

                    <div className="mt-4 rounded-xl border bg-indigo-50 p-3 text-xs text-indigo-900">
                        <div className="font-semibold">OCR guardrails</div>
                        <ul className="mt-1 list-disc pl-5">
                            <li>All pages OCR limited to {MAX_ALL_PAGES} pages</li>
                            <li>Range OCR limited to {MAX_RANGE_PAGES} pages</li>
                            <li>
                                DPI limited to {MIN_DPI}–{MAX_DPI} for performance
                            </li>
                        </ul>
                        <div className="mt-2">
                            Need more pages? Split first:{" "}
                            <Link href="/pdf/split" className="underline font-semibold">
                                PDF Split →
                            </Link>
                        </div>
                    </div>

                    {warn ? (
                        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                            ⚠️ {warn}
                        </div>
                    ) : null}

                    <button
                        className="mt-5 w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white hover:bg-black disabled:opacity-50"
                        onClick={runOcr}
                        disabled={!file || busy || freeRemaining <= 0}
                        title={freeRemaining <= 0 ? "Free usage limit reached" : undefined}
                    >
                        {busy ? "Running OCR..." : freeRemaining <= 0 ? "Locked (upgrade)" : "OCR → DOCX & Download"}
                    </button>

                    {msg ? <div className="mt-3 text-sm text-gray-800">{msg}</div> : null}
                </div>
            </div>
        </ToolCard>
    );
}
