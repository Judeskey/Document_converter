"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import { PDFDocument } from "pdf-lib";
import ToolCard from "@/components/ToolCard";
import UploadCard from "@/components/UploadCard";

type UsageJson = {
    tool: string;
    freeUsed: boolean;
    freeRemaining: number;
};

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
}

export default function PdfSplitTool() {
    const [splitFile, setSplitFile] = useState<File | null>(null);
    const [splitMode, setSplitMode] = useState<"range" | "page" | "parts">("range");
    const [splitStart, setSplitStart] = useState("1");
    const [splitEnd, setSplitEnd] = useState("1");
    const [splitChunkSize, setSplitChunkSize] = useState("5");

    const [splitTotalPages, setSplitTotalPages] = useState<number | null>(null);
    const [splitBusy, setSplitBusy] = useState(false);
    const [splitMsg, setSplitMsg] = useState("");

    // ✅ Per-tool usage
    const TOOL_ID = "pdf-split";
    const isDev = process.env.NODE_ENV !== "production";
    const [freeUsed, setFreeUsed] = useState(false);
    const [freeRemaining, setFreeRemaining] = useState(0);

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

    const locked = freeRemaining <= 0;

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
        setSplitTotalPages(null);

        // reset defaults
        setSplitMode("range");
        setSplitStart("1");
        setSplitEnd("1");

        if (!f) return;

        try {
            const bytes = await f.arrayBuffer();
            const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
            const pages = doc.getPageCount();
            setSplitTotalPages(pages);

            // friendly defaults
            setSplitStart("1");
            setSplitEnd(String(pages));
        } catch {
            setSplitMsg("Could not read the PDF page count (file may be corrupted or locked).");
        }
    }

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

    const onUploadPick = useCallback(
        (input: any) => {
            const f = pickFirstFile(input);
            onPickSplitPdf(f);
        },
        [pickFirstFile]
    );

    // ✅ Dev-only reset (requires /api/usage/pdf-split/reset)
    async function resetDevOnly() {
        if (!isDev) return;
        setSplitMsg("");
        setSplitBusy(true);
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
            setSplitMsg("Reset done (dev only).");
        } catch (e: any) {
            setSplitMsg(e?.message || "Reset failed.");
        } finally {
            setSplitBusy(false);
        }
    }

    async function preflightUsageOrStop(): Promise<boolean> {
        try {
            setSplitMsg("Checking free usage...");
            const usage = await getUsage();
            setFreeUsed(Boolean(usage.freeUsed));
            setFreeRemaining(Number(usage.freeRemaining ?? 0));

            if (usage.freeRemaining <= 0) {
                setSplitMsg("Free usage limit reached. Please upgrade to continue using PDF Split.");
                return false;
            }
            return true;
        } catch (e: any) {
            setSplitMsg(e?.message || "Unable to check usage right now.");
            return false;
        }
    }

    async function burnAfterSuccess() {
        try {
            await burnUsage();
        } catch (burnErr) {
            console.error("Usage burn failed:", burnErr);
        }
        await refreshUsageUI();
    }

    async function splitPdfIntoParts() {
        setSplitMsg("");

        if (!splitFile) {
            setSplitMsg("Please choose a PDF first.");
            return;
        }

        const okToRun = await preflightUsageOrStop();
        if (!okToRun) return;

        const chunk = parseInt(splitChunkSize || "5", 10);
        if (!Number.isFinite(chunk) || chunk < 1) {
            setSplitMsg("Pages per part must be 1 or more.");
            return;
        }

        const total = splitTotalPages ?? 0;
        if (!total) {
            setSplitMsg("Page count not available. Re-select the PDF.");
            return;
        }

        const parts = Math.ceil(total / chunk);

        setSplitBusy(true);
        try {
            // ✅ If only ONE part, download a single PDF (no ZIP)
            if (parts <= 1) {
                const form = new FormData();
                form.append("file", splitFile);
                form.append("mode", "range");
                form.append("start", "1");
                form.append("end", String(total));

                const res = await fetch("/api/split-pdf", { method: "POST", body: form });
                if (!res.ok) {
                    const j = await res.json().catch(() => null);
                    throw new Error(j?.error || `Split failed (${res.status})`);
                }

                const blob = await res.blob();
                const cd = res.headers.get("content-disposition") || "";
                const match = /filename="([^"]+)"/.exec(cd);
                const filename = match?.[1] || "split.pdf";

                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);

                // ✅ burn after successful download generation
                await burnAfterSuccess();

                setSplitMsg("Split ✅ Download started (single PDF).");
                return;
            }

            // ✅ Multiple parts -> ZIP
            const zipForm = new FormData();
            zipForm.append("file", splitFile);
            zipForm.append("chunk", String(chunk));

            const zipRes = await fetch("/api/split-pdf-zip", { method: "POST", body: zipForm });
            if (!zipRes.ok) {
                const j = await zipRes.json().catch(() => null);
                throw new Error(j?.error || `Split ZIP failed (${zipRes.status})`);
            }

            const zipBlob = await zipRes.blob();
            const cd = zipRes.headers.get("content-disposition") || "";
            const match = /filename="([^"]+)"/.exec(cd);
            const filename = match?.[1] || "split.zip";

            const url = URL.createObjectURL(zipBlob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);

            // ✅ burn after successful download generation
            await burnAfterSuccess();

            setSplitMsg(`Split ✅ ZIP download started (${parts} files inside).`);
        } catch (e: any) {
            setSplitMsg(e?.message || "Split error.");
        } finally {
            setSplitBusy(false);
        }
    }

    async function splitPdf() {
        setSplitMsg("");

        if (!splitFile) {
            setSplitMsg("Please choose a PDF first.");
            return;
        }

        if (splitMode === "parts") {
            await splitPdfIntoParts();
            return;
        }

        const okToRun = await preflightUsageOrStop();
        if (!okToRun) return;

        const total = splitTotalPages ?? 0;

        const startNumRaw = parseInt(splitStart || "1", 10);
        const endNumRaw = parseInt(splitEnd || splitStart || "1", 10);

        if (!Number.isFinite(startNumRaw) || startNumRaw < 1) {
            setSplitMsg("Start page must be a number (1 or more).");
            return;
        }
        if (splitMode === "range" && (!Number.isFinite(endNumRaw) || endNumRaw < 1)) {
            setSplitMsg("End page must be a number (1 or more).");
            return;
        }

        const startNum = total ? clamp(startNumRaw, 1, total) : startNumRaw;
        const endNum = total ? clamp(endNumRaw, 1, total) : endNumRaw;

        setSplitBusy(true);
        try {
            const form = new FormData();
            form.append("file", splitFile);
            form.append("mode", splitMode); // range | page
            form.append("start", String(startNum));
            form.append("end", splitMode === "range" ? String(endNum) : String(startNum));

            const res = await fetch("/api/split-pdf", { method: "POST", body: form });
            if (!res.ok) {
                const j = await res.json().catch(() => null);
                throw new Error(j?.error || `Split failed (${res.status})`);
            }

            const blob = await res.blob();
            const cd = res.headers.get("content-disposition") || "";
            const match = /filename="([^"]+)"/.exec(cd);
            const filename = match?.[1] || "split.pdf";

            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);

            // ✅ burn after successful download generation
            await burnAfterSuccess();

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
                    disabled={splitBusy}
                    valueLabel={fileLabel}
                    onPick={onUploadPick}
                    onClear={() => onPickSplitPdf(null)}
                />

                <div className="rounded-2xl border bg-white p-5">
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
                                disabled={splitBusy}
                                onClick={resetDevOnly}
                            >
                                Reset (dev only)
                            </button>
                        ) : null}
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                        <div className="sm:col-span-1">
                            <label className="text-sm font-semibold text-gray-900">Mode</label>
                            <select
                                className="mt-2 w-full rounded-xl border px-3 py-2 text-sm"
                                value={splitMode}
                                onChange={(e) => setSplitMode(e.target.value as "range" | "page" | "parts")}
                                disabled={splitBusy}
                            >
                                <option value="range">Page range</option>
                                <option value="page">Single page</option>
                                <option value="parts">Split into parts (every N pages)</option>
                            </select>
                        </div>

                        {splitMode === "parts" ? (
                            <div className="sm:col-span-2">
                                <label className="text-sm font-semibold text-gray-900">Pages per part</label>
                                <input
                                    className="mt-2 w-full rounded-xl border px-3 py-2 text-sm"
                                    value={splitChunkSize}
                                    onChange={(e) => setSplitChunkSize(e.target.value)}
                                    inputMode="numeric"
                                    disabled={splitBusy}
                                    placeholder="5"
                                />
                                <div className="mt-1 text-xs text-gray-600">
                                    {splitPartsPreview
                                        ? `Preview: ${splitPartsPreview.examples.join(", ")} … (${splitPartsPreview.parts} part(s))`
                                        : "Select a PDF to see a preview."}
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="sm:col-span-1">
                                    <label className="text-sm font-semibold text-gray-900">
                                        {splitMode === "page" ? "Page" : "Start"}
                                    </label>
                                    <input
                                        className="mt-2 w-full rounded-xl border px-3 py-2 text-sm"
                                        value={splitStart}
                                        onChange={(e) => setSplitStart(e.target.value)}
                                        inputMode="numeric"
                                        disabled={splitBusy}
                                        placeholder="1"
                                    />
                                </div>

                                <div className="sm:col-span-1">
                                    <label className="text-sm font-semibold text-gray-900">End</label>
                                    <input
                                        className="mt-2 w-full rounded-xl border px-3 py-2 text-sm"
                                        value={splitEnd}
                                        onChange={(e) => setSplitEnd(e.target.value)}
                                        inputMode="numeric"
                                        disabled={splitBusy || splitMode === "page"}
                                        placeholder="1"
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    <button
                        className="mt-4 w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white hover:bg-black disabled:opacity-50"
                        onClick={splitPdf}
                        disabled={splitBusy || locked}
                        title={locked ? "Free usage limit reached" : undefined}
                    >
                        {splitBusy
                            ? "Splitting..."
                            : locked
                                ? "Locked (upgrade)"
                                : splitMode === "parts"
                                    ? "Split into Parts & Download"
                                    : "Split & Download"}
                    </button>

                    {splitMsg ? <div className="mt-3 text-sm text-gray-700">{splitMsg}</div> : null}
                </div>
            </div>
        </ToolCard>
    );
}
