// File: components/tools/PdfMergeTool.tsx
"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import ToolCard from "@/components/ToolCard";
import UploadCard from "@/components/UploadCard";
import GoProButton from "@/components/GoProButton";
import { TOOL_PRICING_HINTS } from "@/lib/tools/pricingHints";
import { TOOL_IDS } from "@/lib/tools/toolIds";
import { useBillingStatus } from "@/hooks/useBillingStatus";

type UsageJson = {
    tool: string;
    freeUsed: boolean;
    freeRemaining: number;
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

export default function PdfMergeTool() {
    const [pdfFiles, setPdfFiles] = useState<File[]>([]);
    const [pdfBusy, setPdfBusy] = useState(false);
    const [gateBusy, setGateBusy] = useState(false);
    const [pdfMsg, setPdfMsg] = useState<string>("");

    // ✅ Canonical tool id (must match /api/usage/[tool])
    const TOOL_ID = TOOL_IDS.pdfMerge;
    const TOOL_KEY = TOOL_ID;

    // ✅ Billing truth (single source of PRO)
    const { billingLoaded, isPro } = useBillingStatus();

    // ✅ Free-user usage UI
    const [freeRemaining, setFreeRemaining] = useState(0);

    // ✅ upgrade UI
    const [blocked, setBlocked] = useState(false);

    const pdfSummary = useMemo(() => {
        if (!pdfFiles.length) return "No PDFs selected";
        const totalKB = Math.round(pdfFiles.reduce((a, f) => a + f.size, 0) / 1024);
        return `${pdfFiles.length} file(s) • ~${totalKB} KB total`;
    }, [pdfFiles]);

    function addPdfFiles(newOnes: File[]) {
        setPdfMsg("");
        setBlocked(false);

        const onlyPdf = newOnes.filter(
            (f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")
        );

        if (!onlyPdf.length) {
            setPdfMsg("Please select PDF files only.");
            return;
        }

        setPdfFiles((prev) => [...prev, ...onlyPdf]);
    }

    const pickFiles = useCallback((input: any): File[] => {
        if (!input) return [];
        if (Array.isArray(input)) return input.filter((x) => x instanceof File) as File[];
        if (input instanceof File) return [input];
        if (input instanceof FileList) return Array.from(input);
        const files = input?.target?.files;
        if (files instanceof FileList) return Array.from(files);
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
            [copy[i], copy[j]] = [copy[j], copy[i]];
            return copy;
        });
    }

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

    async function refreshUsageUI() {
        // only meaningful for FREE users
        if (billingLoaded && isPro) return;

        try {
            const usage = await getUsage();
            setFreeRemaining(Number(usage.freeRemaining ?? 0));
        } catch {
            // ignore
        }
    }

    useEffect(() => {
        refreshUsageUI();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [billingLoaded, isPro]);

    async function checkAccessForFreeUsers(): Promise<boolean> {
        setGateBusy(true);
        setPdfMsg("");
        setBlocked(false);

        try {
            const usage = await getUsage();
            const remaining = Number(usage.freeRemaining ?? 0);
            setFreeRemaining(remaining);

            if (remaining > 0) return true;

            setBlocked(true);
            setPdfMsg("Free trial used for this tool. Upgrade to Pro to continue.");
            return false;
        } catch (e: any) {
            setPdfMsg(e?.message || "Unable to check access right now.");
            setBlocked(true);
            return false;
        } finally {
            setGateBusy(false);
        }
    }

    async function mergePdf() {
        setPdfMsg("");
        setBlocked(false);

        if (!pdfFiles.length) {
            setPdfMsg("Please add at least one PDF.");
            return;
        }

        // ✅ PRO short-circuit: never run usage gating
        if (!(billingLoaded && isPro)) {
            const allowed = await checkAccessForFreeUsers();
            if (!allowed) return;
        }

        setPdfBusy(true);
        try {
            const form = new FormData();
            pdfFiles.forEach((f) => form.append("files", f));

            const res = await fetch("/api/merge-pdf", { method: "POST", body: form });
            if (!res.ok) throw new Error(await readErrorMessage(res));

            await downloadFromResponse(res, "merged.pdf");

            // ✅ burn usage only if FREE
            if (!(billingLoaded && isPro)) {
                try {
                    await burnUsage();
                    await refreshUsageUI();
                } catch {
                    // ignore burn errors
                }
            }

            setPdfMsg("Merged ✅ Download started.");
        } catch (e: any) {
            setPdfMsg(e?.message || "Merge error.");
        } finally {
            setPdfBusy(false);
        }
    }

    const showPro = billingLoaded && isPro;
    const showUpgradeCard = billingLoaded && !isPro && blocked;

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
                    disabled={pdfBusy || gateBusy}
                    valueLabel={pdfSummary}
                    onPick={onUploadPick}
                    onClear={() => {
                        setPdfFiles([]);
                        setPdfMsg("");
                        setBlocked(false);
                    }}
                />

                <div className="rounded-2xl border bg-white p-5">
                    <div className="text-sm font-semibold text-gray-900">Selected files</div>
                    <div className="mt-1 text-xs text-gray-600">{pdfSummary}</div>

                    {/* ✅ Access panel */}
                    <div className="mt-4 rounded-xl border bg-gray-50 p-3 text-sm text-gray-800">
                        <div className="font-semibold">Access</div>
                        {!billingLoaded ? (
                            <div className="mt-1 text-xs text-gray-700">Checking subscription…</div>
                        ) : showPro ? (
                            <div className="mt-1 text-xs text-gray-700">
                                Plan: <span className="font-semibold">PRO</span> (unlimited)
                            </div>
                        ) : (
                            <div className="mt-1 text-xs text-gray-700">
                                Plan: <span className="font-semibold">FREE</span> • Free remaining:{" "}
                                <span className="font-semibold">{freeRemaining}</span>
                            </div>
                        )}
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
                                    disabled={pdfBusy || gateBusy}
                                >
                                    {pdfBusy ? "Merging..." : gateBusy ? "Checking access..." : "Merge & Download"}
                                </button>

                                <button
                                    className="w-full rounded-xl border px-4 py-3 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50"
                                    onClick={() => {
                                        setPdfFiles([]);
                                        setPdfMsg("");
                                        setBlocked(false);
                                    }}
                                    disabled={pdfBusy}
                                >
                                    Clear all
                                </button>
                            </div>

                            {/* ✅ Upgrade CTA (FREE only) */}
                            {showUpgradeCard ? (
                                <div className="mt-4 rounded-xl border p-4 text-center">
                                    <p className="mb-2 text-sm font-medium">
                                        {TOOL_PRICING_HINTS[TOOL_KEY] ??
                                            "Free usage for this tool is used up. Upgrade to Pro to continue."}
                                    </p>
                                    <p className="mb-3 text-xs text-gray-600">One subscription unlocks all tools.</p>
                                    <GoProButton />
                                </div>
                            ) : null}
                        </>
                    ) : null}

                    {pdfMsg ? <div className="mt-3 text-sm text-gray-700">{pdfMsg}</div> : null}
                </div>
            </div>
        </ToolCard>
    );
}
