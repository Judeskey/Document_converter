// File: components/tools/PdfToImageTool.tsx
"use client";

import JSZip from "jszip";
import * as pdfjs from "pdfjs-dist";
import { useMemo, useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import ToolCard from "@/components/ToolCard";
import UploadCard from "@/components/UploadCard";
import GoProButton from "@/components/GoProButton";
import { TOOL_PRICING_HINTS } from "@/lib/tools/pricingHints";
import { TOOL_IDS } from "@/lib/tools/toolIds";
import { useBillingStatus } from "@/hooks/useBillingStatus";

// ✅ Public worker file for Next.js
// Ensure this exists: /public/pdf.worker.min.mjs
let pdfWorkerReady = false;

async function ensurePdfWorker() {
    if (pdfWorkerReady) return;
    if (typeof window === "undefined") return;

    const workerUrl = "/pdf.worker.min.mjs";
    (pdfjs as any).GlobalWorkerOptions.workerSrc = workerUrl;

    // If worker isn't reachable, pdfjs may still work with disableWorker fallback,
    // but we keep this check to catch missing deployments early.
    const res = await fetch(workerUrl, { cache: "no-store" });
    if (!res.ok) {
        throw new Error(
            "PDF worker is not reachable. Make sure /public/pdf.worker.min.mjs exists and is deployed."
        );
    }

    pdfWorkerReady = true;
}

function pickFirstFile(input: any): File | null {
    if (!input) return null;
    if (Array.isArray(input)) return input[0] ?? null;
    if (input instanceof File) return input;
    if (input instanceof FileList) return input[0] ?? null;
    const files = input?.target?.files;
    if (files instanceof FileList) return files[0] ?? null;
    return null;
}

async function readErrorMessage(res: Response) {
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
        const j = await res.json().catch(() => null);
        if ((j as any)?.error) return String((j as any).error);
        if ((j as any)?.message) return String((j as any).message);
    }
    const t = await res.text().catch(() => "");
    return t || `Request failed (${res.status})`;
}

type UsageJson = {
    tool: string;
    freeUsed: boolean;
    freeRemaining: number;
};

// MVP guardrail
const MAX_ALL_PAGES = 50;

export default function PdfToImageTool() {
    const [p2iFile, setP2iFile] = useState<File | null>(null);
    const [p2iTotalPages, setP2iTotalPages] = useState<number | null>(null);

    // ✅ restore UI options
    const [p2iMode, setP2iMode] = useState<"first" | "all">("first");
    const [p2iOut, setP2iOut] = useState<"png" | "jpg">("png");
    const [p2iDpi, setP2iDpi] = useState("200");

    const [p2iBusy, setP2iBusy] = useState(false);
    const [p2iMsg, setP2iMsg] = useState("");

    // ✅ gating UI
    const [blocked, setBlocked] = useState(false);
    const [gateBusy, setGateBusy] = useState(false);

    // ✅ canonical tool id
    const TOOL_ID = TOOL_IDS.pdfToImage ?? "pdf-to-image";
    const TOOL_KEY = TOOL_ID;

    // ✅ Billing truth (single source)
    const { billingLoaded, isPro } = useBillingStatus();
    const pro = billingLoaded && isPro;

    const fileLabel = useMemo(() => {
        if (!p2iFile) return "No PDF selected";
        const kb = Math.round(p2iFile.size / 1024);
        const pages = p2iTotalPages ?? "—";
        return `${p2iFile.name} (${kb} KB) • Total pages: ${pages}`;
    }, [p2iFile, p2iTotalPages]);

    async function onPickPdfToImage(f: File | null) {
        setP2iFile(f);
        setP2iMsg("");
        setBlocked(false);
        setP2iTotalPages(null);
        setP2iMode("first");

        if (!f) return;

        try {
            const bytes = await f.arrayBuffer();
            const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
            setP2iTotalPages(doc.getPageCount());
        } catch {
            setP2iMsg("Could not read the PDF page count.");
        }
    }

    const onUploadPick = useCallback((input: any) => {
        const f = pickFirstFile(input);
        onPickPdfToImage(f);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function getUsage(): Promise<UsageJson> {
        const res = await fetch(`/api/usage/${TOOL_ID}`, {
            method: "GET",
            credentials: "include",
            headers: { Accept: "application/json" },
            cache: "no-store",
        });

        if (!res.ok) throw new Error(await readErrorMessage(res));
        return (await res.json()) as UsageJson;
    }

    async function burnUsage(): Promise<void> {
        const res = await fetch(`/api/usage/${TOOL_ID}`, {
            method: "POST",
            credentials: "include",
            headers: { Accept: "application/json" },
        });

        if (!res.ok) throw new Error(await readErrorMessage(res));
    }

    async function checkAccessFreeOnly(): Promise<boolean> {
        // ✅ PRO short-circuit: never block, never check usage
        if (pro) return true;

        setGateBusy(true);
        setP2iMsg("");
        setBlocked(false);

        try {
            const usage = await getUsage();
            const remaining = Number(usage.freeRemaining ?? 0);

            if (remaining > 0) return true;

            setBlocked(true);
            setP2iMsg("Free trial used for this tool. Upgrade to Pro to continue.");
            return false;
        } catch (e: any) {
            // fail-closed for FREE users (safer)
            setBlocked(true);
            setP2iMsg(e?.message || "Unable to check access right now.");
            return false;
        } finally {
            setGateBusy(false);
        }
    }

    async function convertPdfToImageClient() {
        setP2iMsg("");
        setBlocked(false);

        if (!p2iFile) {
            setP2iMsg("Please choose a PDF first.");
            return;
        }

        const allowed = await checkAccessFreeOnly();
        if (!allowed) return;

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

            if (p2iMode === "all" && total > MAX_ALL_PAGES) {
                setP2iMsg(
                    `This PDF has ${total} pages. For MVP we limit “All pages” to ${MAX_ALL_PAGES}.`
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

                // white background
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                await page.render({ canvasContext: ctx, viewport }).promise;

                const mime = p2iOut === "png" ? "image/png" : "image/jpeg";
                const quality = p2iOut === "jpg" ? 0.85 : undefined;

                return await new Promise<Blob>((resolve, reject) => {
                    canvas.toBlob(
                        (b) => (b ? resolve(b) : reject(new Error("Failed to create image."))),
                        mime,
                        quality as any
                    );
                });
            };

            // ✅ First page download
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

                // ✅ burn usage ONLY if FREE (best-effort)
                if (!pro) {
                    try {
                        await burnUsage();
                    } catch {
                        // ignore burn failure
                    }
                }

                setP2iMsg("Done ✅ Image download started.");
                return;
            }

            // ✅ All pages ZIP
            const zip = new JSZip();
            const ext = p2iOut === "png" ? "png" : "jpg";

            for (let p = 1; p <= total; p++) {
                setP2iMsg(`Rendering page ${p} of ${total}...`);
                const blob = await renderPage(p);
                zip.file(`${base}_page_${p}.${ext}`, await blob.arrayBuffer());
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

            // ✅ burn usage ONLY if FREE (best-effort)
            if (!pro) {
                try {
                    await burnUsage();
                } catch {
                    // ignore burn failure
                }
            }

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
            subtitle="Convert PDF pages into PNG/JPG (single page or ZIP)."
            badge="High value"
            gradient="from-indigo-500 to-violet-500"
            icon="🧾"
        >
            <div className="grid gap-4">
                <UploadCard
                    title="Upload a PDF"
                    subtitle="Drag & drop a PDF here, or click to choose."
                    accept="application/pdf,.pdf"
                    disabled={p2iBusy || gateBusy}
                    valueLabel={fileLabel}
                    onPick={onUploadPick}
                    onClear={() => onPickPdfToImage(null)}
                />

                <div className="rounded-2xl border bg-white p-5">
                    {/* Optional Access banner (helps debugging) */}
                    <div className="mb-4 rounded-xl border bg-gray-50 p-3 text-sm text-gray-800">
                        <div className="font-semibold">Access</div>
                        {!billingLoaded ? (
                            <div className="mt-1 text-xs text-gray-700">Checking subscription…</div>
                        ) : pro ? (
                            <div className="mt-1 text-xs text-gray-700">
                                Plan: <span className="font-semibold">PRO</span> (unlimited)
                            </div>
                        ) : (
                            <div className="mt-1 text-xs text-gray-700">
                                Plan: <span className="font-semibold">FREE</span> (limited)
                            </div>
                        )}
                    </div>

                    {/* ✅ restored controls */}
                    <div className="grid gap-4 sm:grid-cols-3">
                        <div>
                            <label className="text-sm font-semibold">Pages</label>
                            <select
                                className="mt-2 w-full rounded-xl border bg-white px-3 py-2 text-sm"
                                value={p2iMode}
                                onChange={(e) => setP2iMode(e.target.value as any)}
                                disabled={p2iBusy || gateBusy}
                            >
                                <option value="first">First page only</option>
                                <option value="all">All pages → ZIP</option>
                            </select>
                            <div className="mt-1 text-xs text-gray-600">All pages limited to {MAX_ALL_PAGES} pages.</div>
                        </div>

                        <div>
                            <label className="text-sm font-semibold">Output</label>
                            <select
                                className="mt-2 w-full rounded-xl border bg-white px-3 py-2 text-sm"
                                value={p2iOut}
                                onChange={(e) => setP2iOut(e.target.value as any)}
                                disabled={p2iBusy || gateBusy}
                            >
                                <option value="png">PNG</option>
                                <option value="jpg">JPG</option>
                            </select>
                            <div className="mt-1 text-xs text-gray-600">PNG = sharper, JPG = smaller</div>
                        </div>

                        <div>
                            <label className="text-sm font-semibold">DPI</label>
                            <input
                                className="mt-2 w-full rounded-xl border bg-white px-3 py-2 text-sm"
                                value={p2iDpi}
                                onChange={(e) => setP2iDpi(e.target.value)}
                                inputMode="numeric"
                                disabled={p2iBusy || gateBusy}
                            />
                            <div className="mt-1 text-xs text-gray-600">72–300 (default 200)</div>
                        </div>
                    </div>

                    <button
                        className="mt-5 w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white hover:bg-black disabled:opacity-50"
                        onClick={convertPdfToImageClient}
                        disabled={!p2iFile || p2iBusy || gateBusy}
                    >
                        {p2iBusy
                            ? "Converting..."
                            : gateBusy
                                ? "Checking access..."
                                : p2iMode === "all"
                                    ? "Convert All Pages & Download ZIP"
                                    : "Convert First Page & Download"}
                    </button>

                    {/* ✅ Upgrade CTA only when blocked AND not PRO */}
                    {!pro && blocked ? (
                        <div className="mt-4 rounded-xl border p-4 text-center">
                            <p className="mb-2 text-sm font-medium">
                                {TOOL_PRICING_HINTS[TOOL_KEY] || "Free use exhausted. Please subscribe to continue."}
                            </p>
                            <p className="mb-3 text-xs text-gray-600">One subscription unlocks all tools.</p>
                            <GoProButton />
                        </div>
                    ) : null}

                    {p2iMsg ? <div className="mt-3 text-sm text-gray-700">{p2iMsg}</div> : null}
                </div>
            </div>
        </ToolCard>
    );
}
