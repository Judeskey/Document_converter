"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import ToolCard from "@/components/ToolCard";
import UploadCard from "@/components/UploadCard";

type UsageJson = {
    tool: string;
    freeUsed: boolean;
    freeRemaining: number;
};

export default function PdfMergeTool() {
    const [pdfFiles, setPdfFiles] = useState<File[]>([]);
    const [pdfBusy, setPdfBusy] = useState(false);
    const [pdfMsg, setPdfMsg] = useState<string>("");

    // Usage UI
    const [freeUsed, setFreeUsed] = useState(false);
    const [freeRemaining, setFreeRemaining] = useState(0);

    const TOOL_ID = "pdf-merge";
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

    const locked = freeRemaining <= 0;

    const pdfSummary = useMemo(() => {
        if (!pdfFiles.length) return "No PDFs selected";
        const totalKB = Math.round(pdfFiles.reduce((a, f) => a + f.size, 0) / 1024);
        return `${pdfFiles.length} file(s) • ~${totalKB} KB total`;
    }, [pdfFiles]);

    function addPdfFiles(newOnes: File[]) {
        setPdfMsg("");

        const onlyPdf = newOnes.filter(
            (f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")
        );

        if (!onlyPdf.length) {
            setPdfMsg("Please select PDF files only.");
            return;
        }

        setPdfFiles((prev) => [...prev, ...onlyPdf]);
    }

    // UploadCard may pass File | File[] | FileList | input event
    const pickFiles = useCallback((input: any): File[] => {
        if (!input) return [];

        if (Array.isArray(input)) return input.filter((x) => x instanceof File) as File[];
        if (typeof File !== "undefined" && input instanceof File) return [input];

        if (typeof FileList !== "undefined" && input instanceof FileList) return Array.from(input);

        const maybeFiles = input?.target?.files;
        if (maybeFiles && typeof FileList !== "undefined" && maybeFiles instanceof FileList) {
            return Array.from(maybeFiles);
        }

        if (Array.isArray(input?.files)) return input.files;

        return [];
    }, []);

    const onUploadPick = useCallback(
        (input: any) => {
            const files = pickFiles(input);
            if (files.length) addPdfFiles(files);
        },
        [pickFiles]
    );

    function movePdf(i: number, dir: -1 | 1) {
        setPdfFiles((prev) => {
            const j = i + dir;
            if (j < 0 || j >= prev.length) return prev;
            const copy = [...prev];
            const tmp = copy[i];
            copy[i] = copy[j];
            copy[j] = tmp;
            return copy;
        });
    }

    async function mergePdf() {
        setPdfMsg("");

        if (!pdfFiles.length) {
            setPdfMsg("Please add at least one PDF.");
            return;
        }

        // ✅ Preflight: check usage BEFORE uploading/merging
        try {
            const usage = await getUsage();
            setFreeUsed(Boolean(usage.freeUsed));
            setFreeRemaining(Number(usage.freeRemaining ?? 0));

            if (usage.freeRemaining <= 0) {
                setPdfMsg("Free usage limit reached. Please upgrade to continue using PDF Merge.");
                return;
            }
        } catch (e: any) {
            setPdfMsg(e?.message || "Unable to check usage right now.");
            return;
        }

        setPdfBusy(true);
        try {
            const form = new FormData();
            pdfFiles.forEach((f) => form.append("files", f));

            const res = await fetch("/api/merge-pdf", { method: "POST", body: form });
            if (!res.ok) {
                const j = await res.json().catch(() => null);
                throw new Error(j?.error || `Merge failed (${res.status})`);
            }

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "merged.pdf";
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);

            // ✅ Burn usage ONLY after success (don’t block download if burn fails)
            try {
                await burnUsage();
            } catch (burnErr) {
                console.error("Usage burn failed:", burnErr);
            }

            await refreshUsageUI();
            setPdfMsg("Merged ✅ Download started.");
        } catch (e: any) {
            setPdfMsg(e?.message || "Merge error.");
        } finally {
            setPdfBusy(false);
        }
    }

    async function resetDevOnly() {
        if (!isDev) return;
        setPdfMsg("");
        setPdfBusy(true);
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
            setPdfMsg("Reset done (dev only).");
        } catch (e: any) {
            setPdfMsg(e?.message || "Reset failed.");
        } finally {
            setPdfBusy(false);
        }
    }

    return (
        <ToolCard
            title="PDF Merge"
            subtitle="Upload multiple PDFs, reorder, merge, download."
            badge="Popular"
            gradient="from-blue-500 to-cyan-500"
            icon="🧩"
        >
            <div className="grid gap-4">
                <UploadCard
                    title="Upload PDFs to merge"
                    subtitle="Drag & drop multiple PDFs here, or click to choose."
                    accept="application/pdf,.pdf"
                    disabled={pdfBusy}
                    valueLabel={pdfSummary}
                    onPick={onUploadPick}
                    onClear={() => {
                        setPdfFiles([]);
                        setPdfMsg("");
                    }}
                />

                <div className="rounded-2xl border bg-white p-5">
                    <div className="text-sm font-semibold text-gray-900">Selected files</div>
                    <div className="mt-1 text-xs text-gray-600">{pdfSummary}</div>

                    {/* Usage panel */}
                    <div className="mt-3 rounded-xl border bg-gray-50 p-3 text-sm text-gray-800">
                        <div className="font-semibold">Usage (this tool)</div>
                        <div className="mt-1 text-xs text-gray-700">
                            Free used: <span className="font-semibold">{freeUsed ? "Yes" : "No"}</span> • Free remaining:{" "}
                            <span className="font-semibold">{freeRemaining}</span>
                        </div>
                        {isDev ? (
                            <button
                                className="mt-2 inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold
                           bg-gray-900 text-white hover:bg-black disabled:opacity-50"
                                disabled={pdfBusy}
                                onClick={resetDevOnly}
                            >
                                Reset (dev only)
                            </button>
                        ) : null}
                    </div>

                    {pdfFiles.length ? (
                        <>
                            <div className="mt-4 rounded-xl border p-3">
                                <div className="text-xs text-gray-600">Order matters (top → bottom)</div>
                                <div className="mt-2 flex flex-col gap-2">
                                    {pdfFiles.map((f, i) => (
                                        <div key={`${f.name}-${i}`} className="flex items-center justify-between gap-3">
                                            <div className="truncate text-sm">
                                                {i + 1}. {f.name}
                                            </div>
                                            <div className="flex items-center gap-3 text-xs">
                                                <button className="underline" onClick={() => movePdf(i, -1)} disabled={pdfBusy || i === 0}>
                                                    Up
                                                </button>
                                                <button
                                                    className="underline"
                                                    onClick={() => movePdf(i, 1)}
                                                    disabled={pdfBusy || i === pdfFiles.length - 1}
                                                >
                                                    Down
                                                </button>
                                                <button
                                                    className="underline"
                                                    onClick={() => setPdfFiles((prev) => prev.filter((_, idx) => idx !== i))}
                                                    disabled={pdfBusy}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                                <button
                                    className="w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white hover:bg-black disabled:opacity-50"
                                    onClick={mergePdf}
                                    disabled={pdfBusy || locked}
                                    title={locked ? "Free usage limit reached" : undefined}
                                >
                                    {pdfBusy ? "Merging..." : locked ? "Locked (upgrade)" : "Merge & Download"}
                                </button>

                                <button
                                    className="w-full rounded-xl border px-4 py-3 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50"
                                    onClick={() => {
                                        setPdfFiles([]);
                                        setPdfMsg("");
                                    }}
                                    disabled={pdfBusy}
                                >
                                    Clear all
                                </button>
                            </div>
                        </>
                    ) : null}

                    {pdfMsg ? <div className="mt-3 text-sm text-gray-700">{pdfMsg}</div> : null}
                </div>
            </div>
        </ToolCard>
    );
}
