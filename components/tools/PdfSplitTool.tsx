// File: components/tools/PdfSplitTool.tsx
"use client";

import { useMemo, useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import ToolCard from "@/components/ToolCard";
import UploadCard from "@/components/UploadCard";
import GoProButton from "@/components/GoProButton";
import { TOOL_PRICING_HINTS } from "@/lib/tools/pricingHints";
import { TOOL_IDS } from "@/lib/tools/toolIds";

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
}

type UsageJson = {
    tool: string;
    freeUsed: boolean;
    freeRemaining: number;
    isPro?: boolean;
};

async function readErrorMessage(res: Response) {
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
        const j = await res.json().catch(() => null);
        if (j?.error) return String(j.error);
        if (j?.message) return String(j.message);
    }
    const t = await res.text().catch(() => "");
    return t || `Request failed (${res.status})`;
}

async function downloadFromResponse(res: Response, fallbackName: string) {
    const blob = await res.blob();
    const cd = res.headers.get("content-disposition") || "";
    const match = /filename="([^"]+)"/.exec(cd);
    const filename = match?.[1] || fallbackName;

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

export default function PdfSplitTool() {
    const [splitFile, setSplitFile] = useState<File | null>(null);
    const [splitMode, setSplitMode] = useState<"range" | "page" | "parts">("range");
    const [splitStart, setSplitStart] = useState("1");
    const [splitEnd, setSplitEnd] = useState("1");
    const [splitChunkSize, setSplitChunkSize] = useState("5");

    // ✅ Canonical ids
    const TOOL_ID = TOOL_IDS.pdfSplit; // must match /api/usage/[tool]
    const TOOL_KEY = TOOL_ID; // pricing hint key aligned with tool id

    const [splitTotalPages, setSplitTotalPages] = useState<number | null>(null);
    const [splitBusy, setSplitBusy] = useState(false);
    const [splitMsg, setSplitMsg] = useState("");

    // ✅ unified server-truth gating
    const [blocked, setBlocked] = useState(false);
    const [gateBusy, setGateBusy] = useState(false);

    const fileLabel = useMemo(() => {
        if (!splitFile) return "No PDF selected";
        const kb = Math.round(splitFile.size / 1024);
        const pages = splitTotalPages ?? "—";
        return `${splitFile.name} (${kb} KB) • Total pages: ${pages}`;
    }, [splitFile, splitTotalPages]);

    const splitPartsPreview = useMemo(() => {
        if (!splitTotalPages) return null;
        const chunk = parseInt(splitChunkSize || "0", 10);
        if (!Number.isFinite(chunk) || chunk <= 0) return null;

        const parts = Math.ceil(splitTotalPages / chunk);
        const examples: string[] = [];
        const maxShow = Math.min(parts, 3);

        for (let i = 0; i < maxShow; i++) {
            const start = i * chunk + 1;
            const end = Math.min(splitTotalPages, start + chunk - 1);
            examples.push(`${start}–${end}`);
        }

        return { parts, examples };
    }, [splitTotalPages, splitChunkSize]);

    async function onPickSplitPdf(f: File | null) {
        setSplitFile(f);
        setSplitMsg("");
        setBlocked(false);
        setSplitTotalPages(null);

        setSplitMode("range");
        setSplitStart("1");
        setSplitEnd("1");

        if (!f) return;

        try {
            const bytes = await f.arrayBuffer();
            const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
            const pages = doc.getPageCount();
            setSplitTotalPages(pages);
            setSplitEnd(String(pages));
        } catch {
            setSplitMsg("Could not read the PDF page count.");
        }
    }

    const pickFirstFile = useCallback((input: any): File | null => {
        if (!input) return null;
        if (Array.isArray(input)) return input[0] ?? null;
        if (input instanceof File) return input;
        if (input instanceof FileList) return input[0] ?? null;
        const files = input?.target?.files;
        if (files instanceof FileList) return files[0] ?? null;
        return null;
    }, []);

    const onUploadPick = useCallback(
        (input: any) => {
            const f = pickFirstFile(input);
            onPickSplitPdf(f);
        },
        [pickFirstFile]
    );

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

    async function checkAccess(): Promise<boolean> {
        setGateBusy(true);
        try {
            const usage = await getUsage();
            const isPro = Boolean(usage.isPro);
            const freeRemaining = Number(usage.freeRemaining ?? 0);

            const allowed = isPro || freeRemaining > 0;
            if (!allowed) setBlocked(true);
            return allowed;
        } catch (e: any) {
            setSplitMsg(e?.message || "Unable to check access right now.");
            setBlocked(true);
            return false;
        } finally {
            setGateBusy(false);
        }
    }

    async function splitPdf() {
        setSplitMsg("");
        setBlocked(false);

        if (!splitFile) {
            setSplitMsg("Please choose a PDF first.");
            return;
        }

        const allowed = await checkAccess();
        if (!allowed) return;

        const total = splitTotalPages ?? 0;

        // ---- parts mode (ZIP) ----
        if (splitMode === "parts") {
            const chunk = parseInt(splitChunkSize || "5", 10);
            if (!Number.isFinite(chunk) || chunk < 1) {
                setSplitMsg("Pages per part must be 1 or more.");
                return;
            }

            setSplitBusy(true);
            try {
                const form = new FormData();
                form.append("file", splitFile);
                form.append("chunk", String(chunk));

                const res = await fetch("/api/split-pdf-zip", { method: "POST", body: form });
                if (!res.ok) throw new Error(await readErrorMessage(res));

                await downloadFromResponse(res, "split.zip");

                // ✅ burn only after success (best-effort)
                try {
                    const usage = await getUsage();
                    if (!usage.isPro) await burnUsage();
                } catch {
                    // ignore burn errors
                }

                setSplitMsg("Split ✅ ZIP download started.");
            } catch (e: any) {
                setSplitMsg(e?.message || "Split error.");
            } finally {
                setSplitBusy(false);
            }
            return;
        }

        // ---- range/page mode ----
        const startNum = clamp(parseInt(splitStart || "1", 10), 1, total || 1);
        const endNum =
            splitMode === "range"
                ? clamp(parseInt(splitEnd || splitStart || "1", 10), 1, total || 1)
                : startNum;

        setSplitBusy(true);
        try {
            const form = new FormData();
            form.append("file", splitFile);
            form.append("mode", splitMode);
            form.append("start", String(startNum));
            form.append("end", String(endNum));

            const res = await fetch("/api/split-pdf", { method: "POST", body: form });
            if (!res.ok) throw new Error(await readErrorMessage(res));

            await downloadFromResponse(res, "split.pdf");

            // ✅ burn only after success (best-effort)
            try {
                const usage = await getUsage();
                if (!usage.isPro) await burnUsage();
            } catch {
                // ignore burn errors
            }

            setSplitMsg("Split ✅ Download started.");
        } catch (e: any) {
            setSplitMsg(e?.message || "Split error.");
        } finally {
            setSplitBusy(false);
        }
    }

    return (
        <ToolCard
            title="PDF Split"
            subtitle="Extract a range, a single page, or split into equal parts."
            badge="Flexible"
            gradient="from-emerald-500 to-teal-500"
            icon="✂️"
        >
            <div className="grid gap-4">
                <UploadCard
                    title="Upload a PDF to split"
                    subtitle="Drag & drop a PDF here, or click to choose."
                    accept="application/pdf,.pdf"
                    disabled={splitBusy || gateBusy}
                    valueLabel={fileLabel}
                    onPick={onUploadPick}
                    onClear={() => onPickSplitPdf(null)}
                />

                <div className="rounded-2xl border bg-white p-5">
                    {/* ✅ Split controls */}
                    <div className="grid gap-3 sm:grid-cols-3">
                        <div>
                            <label className="text-sm font-semibold text-gray-900">Split mode</label>
                            <select
                                className="mt-2 w-full rounded-xl border bg-white px-3 py-2 text-sm"
                                value={splitMode}
                                onChange={(e) => setSplitMode(e.target.value as any)}
                                disabled={splitBusy || gateBusy}
                            >
                                <option value="range">Page range</option>
                                <option value="page">Single page</option>
                                <option value="parts">Split into parts</option>
                            </select>
                        </div>

                        {splitMode === "parts" ? (
                            <div>
                                <label className="text-sm font-semibold text-gray-900">Pages per part</label>
                                <input
                                    className="mt-2 w-full rounded-xl border bg-white px-3 py-2 text-sm"
                                    value={splitChunkSize}
                                    onChange={(e) => setSplitChunkSize(e.target.value)}
                                    inputMode="numeric"
                                    disabled={splitBusy || gateBusy}
                                />
                                <div className="mt-1 text-xs text-gray-600">
                                    {splitPartsPreview
                                        ? `${splitPartsPreview.parts} part(s) • Example: ${splitPartsPreview.examples.join(", ")}`
                                        : "Choose how many pages each part should contain."}
                                </div>
                            </div>
                        ) : (
                            <div>
                                <label className="text-sm font-semibold text-gray-900">
                                    {splitMode === "page" ? "Page number" : "Start page"}
                                </label>
                                <input
                                    className="mt-2 w-full rounded-xl border bg-white px-3 py-2 text-sm"
                                    value={splitStart}
                                    onChange={(e) => setSplitStart(e.target.value)}
                                    inputMode="numeric"
                                    disabled={splitBusy || gateBusy}
                                />
                                <div className="mt-1 text-xs text-gray-600">
                                    {splitTotalPages ? `1–${splitTotalPages}` : "Upload a PDF to see total pages."}
                                </div>
                            </div>
                        )}

                        {splitMode === "range" ? (
                            <div>
                                <label className="text-sm font-semibold text-gray-900">End page</label>
                                <input
                                    className="mt-2 w-full rounded-xl border bg-white px-3 py-2 text-sm"
                                    value={splitEnd}
                                    onChange={(e) => setSplitEnd(e.target.value)}
                                    inputMode="numeric"
                                    disabled={splitBusy || gateBusy}
                                />
                                <div className="mt-1 text-xs text-gray-600">
                                    {splitTotalPages ? `1–${splitTotalPages}` : " "}
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-xl border bg-gray-50 p-3 text-sm text-gray-700">
                                <div className="font-semibold">Tip</div>
                                <div className="mt-1">
                                    {splitMode === "page"
                                        ? "Extract just one page into a new PDF."
                                        : "Use Parts to generate a ZIP of multiple PDFs."}
                                </div>
                            </div>
                        )}
                    </div>


                    <button
                        className="mt-4 w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white hover:bg-black disabled:opacity-50"
                        onClick={splitPdf}
                        disabled={splitBusy || gateBusy}
                    >
                        {splitBusy ? "Splitting..." : gateBusy ? "Checking access..." : "Split & Download"}
                    </button>

                    {blocked && (
                        <div className="mt-4 rounded-xl border p-4 text-center">
                            <p className="mb-2 text-sm font-medium">
                                {TOOL_PRICING_HINTS[TOOL_KEY] ?? "Free usage for this tool is used up. Upgrade to Pro to continue."}
                            </p>
                            <p className="mb-3 text-xs text-gray-600">One subscription unlocks all tools.</p>
                            <GoProButton />
                        </div>
                    )}

                    {splitMsg ? <div className="mt-3 text-sm text-gray-700">{splitMsg}</div> : null}
                </div>
            </div>
        </ToolCard>
    );
}
