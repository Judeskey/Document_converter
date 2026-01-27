"use client";

import { useEffect, useMemo, useState } from "react";
import { compressPdfClient, CompressMode, StrongPreset } from "@/lib/pdf/compress";
import ToolCard from "@/components/ToolCard";
import UploadCard from "@/components/UploadCard";
import { TOOL_PRICING_HINTS } from "@/lib/tools/pricingHints";
import GoProButton from "@/components/GoProButton";
import { useBillingStatus } from "@/hooks/useBillingStatus";

type UsageJson = {
    tool: string;
    freeUsed: boolean;
    freeRemaining: number;
};

function fmtBytes(bytes: number) {
    const units = ["B", "KB", "MB", "GB"];
    let v = bytes;
    let i = 0;
    while (v >= 1024 && i < units.length - 1) {
        v /= 1024;
        i++;
    }
    return `${v.toFixed(i === 0 ? 0 : 2)} ${units[i]}`;
}

function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

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

export default function PdfCompressTool() {
    const TOOL_KEY = "pdf-compress";
    const TOOL_ID = "pdf-compress"; // must match /api/usage/[tool]

    const [file, setFile] = useState<File | null>(null);
    const [mode, setMode] = useState<CompressMode>("lossless");
    const [preset, setPreset] = useState<StrongPreset>("balanced");
    const [busy, setBusy] = useState(false);

    const [progress, setProgress] = useState<{ page: number; total: number; stage: string } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [outSize, setOutSize] = useState<number | null>(null);

    // ✅ Usage UI (FREE users)
    const [freeUsed, setFreeUsed] = useState(false);
    const [freeRemaining, setFreeRemaining] = useState(0);

    // ✅ Single source of truth for PRO
    const { billingLoaded, isPro: isProUser } = useBillingStatus();

    // ✅ Upgrade CTA state (free users only)
    const [upgradeRequired, setUpgradeRequired] = useState(false);

    const MAX_MB = 50;

    async function getUsage(): Promise<UsageJson> {
        const res = await fetch(`/api/usage/${TOOL_ID}`, {
            method: "GET",
            credentials: "include",
            headers: { Accept: "application/json" },
            cache: "no-store",
        });

        if (!res.ok) {
            throw new Error(await readErrorMessage(res));
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
            throw new Error(await readErrorMessage(res));
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

    const modeNote = useMemo(() => {
        if (mode === "lossless") {
            return "Keeps text selectable. Best for normal PDFs. Smaller reductions for scanned/image-heavy PDFs.";
        }
        return "Big reduction for scanned/image-heavy PDFs. Output may not keep selectable text (it rebuilds pages as images).";
    }, [mode]);

    const fileLabel = useMemo(() => {
        if (!file) return "No PDF selected";
        return `${file.name} • ${fmtBytes(file.size)}`;
    }, [file]);

    // ✅ IMPORTANT: Do NOT lock while billing is still loading
    // - If billing not loaded yet: allow click, we’ll decide inside onCompress()
    const locked = billingLoaded && !isProUser && freeRemaining <= 0;

    async function onCompress() {
        if (!file) return;

        setError(null);
        setOutSize(null);
        setUpgradeRequired(false);

        // ✅ PRO short-circuit: never check usage
        if (!(billingLoaded && isProUser)) {
            // FREE preflight usage check
            try {
                const usage = await getUsage();
                setFreeUsed(Boolean(usage.freeUsed));
                setFreeRemaining(Number(usage.freeRemaining ?? 0));

                if (Number(usage.freeRemaining ?? 0) <= 0) {
                    setUpgradeRequired(true);
                    setError("Free trial used for this tool. Please upgrade to Pro to continue.");
                    return;
                }
            } catch (e: any) {
                setError(e?.message || "Unable to check usage right now.");
                return;
            }
        }

        setBusy(true);
        setProgress({ page: 0, total: 0, stage: "Starting…" });

        try {
            const sizeMb = file.size / (1024 * 1024);
            if (sizeMb > MAX_MB) throw new Error(`File too large. Max ${MAX_MB}MB.`);

            const blob = await compressPdfClient(
                file,
                { mode, strongPreset: preset, maxPagesStrong: 50 },
                (p) => setProgress(p)
            );

            setOutSize(blob.size);

            const base = file.name.replace(/\.pdf$/i, "");
            const suffix = mode === "lossless" ? "optimized" : `compressed-${preset}`;
            downloadBlob(blob, `${base}-${suffix}.pdf`);

            // ✅ Burn usage only if FREE
            if (!(billingLoaded && isProUser)) {
                try {
                    await burnUsage();
                } catch (burnErr) {
                    console.error("Usage burn failed:", burnErr);
                }
                await refreshUsageUI();
            }
        } catch (e: any) {
            setError(e?.message || "Compression failed.");
        } finally {
            setBusy(false);
            setProgress(null);
        }
    }

    // ✅ UI rules
    const showPro = billingLoaded && isProUser;
    const showFreeUsage = billingLoaded && !isProUser;
    const showUpgradeCard = billingLoaded && !isProUser && (locked || upgradeRequired);

    return (
        <ToolCard title="Compress PDF" subtitle="Reduce PDF size to meet upload limits.">
            <div className="space-y-4">
                <UploadCard
                    title="Upload a PDF to compress"
                    subtitle="Drag & drop a PDF here, or click to choose"
                    accept="application/pdf,.pdf"
                    disabled={busy}
                    valueLabel={fileLabel}
                    onPick={(files) => {
                        const f = files?.[0] ?? null;
                        setFile(f);
                        setOutSize(null);
                        setError(null);
                        setProgress(null);
                        setUpgradeRequired(false);
                    }}
                    onClear={() => {
                        setFile(null);
                        setOutSize(null);
                        setError(null);
                        setProgress(null);
                        setUpgradeRequired(false);
                    }}
                />

                <div className="rounded-xl border bg-white p-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                            <label className="text-sm font-semibold">Mode</label>
                            <select
                                className="mt-2 w-full rounded-xl border bg-white px-3 py-2 text-sm"
                                value={mode}
                                disabled={busy}
                                onChange={(e) => setMode(e.target.value as CompressMode)}
                            >
                                <option value="lossless">Lossless Optimize (recommended)</option>
                                <option value="strong">Strong Compression (scans)</option>
                            </select>
                            <p className="mt-1 text-xs text-gray-600">{modeNote}</p>
                        </div>

                        {mode === "strong" ? (
                            <div>
                                <label className="text-sm font-semibold">Strong preset</label>
                                <select
                                    className="mt-2 w-full rounded-xl border bg-white px-3 py-2 text-sm"
                                    value={preset}
                                    disabled={busy}
                                    onChange={(e) => setPreset(e.target.value as StrongPreset)}
                                >
                                    <option value="balanced">Balanced</option>
                                    <option value="smallest">Smallest</option>
                                    <option value="best">Best quality</option>
                                </select>
                                <p className="mt-1 text-xs text-gray-600">Guardrail: Strong compression supports up to 50 pages.</p>
                            </div>
                        ) : (
                            <div className="rounded-xl border bg-gray-50 p-3 text-sm text-gray-700">
                                <div className="font-semibold">Tip</div>
                                <div className="mt-1">
                                    For scanned PDFs, choose <span className="font-semibold">Strong</span>. For normal PDFs, use{" "}
                                    <span className="font-semibold">Lossless</span>.
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ✅ Status */}
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
                                Plan: <span className="font-semibold">FREE</span>
                            </div>
                        )}
                    </div>

                    {/* ✅ Usage (FREE only) */}
                    {showFreeUsage ? (
                        <div className="mt-3 rounded-xl border bg-gray-50 p-3 text-sm text-gray-800">
                            <div className="font-semibold">Usage (this tool)</div>
                            <div className="mt-1 text-xs text-gray-700">
                                Free used: <span className="font-semibold">{freeUsed ? "Yes" : "No"}</span> • Free remaining:{" "}
                                <span className="font-semibold">{freeRemaining}</span>
                            </div>
                        </div>
                    ) : null}

                    {progress ? (
                        <div className="mt-4 rounded-xl border bg-gray-50 p-3 text-sm text-gray-800">
                            <div className="font-semibold">{progress.stage}</div>
                            {progress.total > 0 ? (
                                <div className="mt-1 text-xs text-gray-600">
                                    Page {progress.page} / {progress.total}
                                </div>
                            ) : null}
                        </div>
                    ) : null}

                    {error ? (
                        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
                            {error}
                        </div>
                    ) : null}

                    {file && outSize != null ? (
                        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
                            <div className="font-semibold">Compression complete</div>
                            <div className="mt-1 text-xs">
                                Before: <span className="font-semibold">{fmtBytes(file.size)}</span> • After:{" "}
                                <span className="font-semibold">{fmtBytes(outSize)}</span>
                            </div>
                        </div>
                    ) : null}

                    <button
                        className="mt-4 w-full rounded-xl px-4 py-3 text-sm font-semibold transition bg-gray-900 text-white hover:bg-black disabled:opacity-50"
                        onClick={onCompress}
                        disabled={!file || busy || locked}
                        title={locked ? "Free usage limit reached" : undefined}
                    >
                        {busy ? "Compressing..." : locked ? "Locked (upgrade)" : "Compress & Download"}
                    </button>

                    {/* ✅ Upgrade CTA: never for PRO */}
                    {showUpgradeCard ? (
                        <div className="mt-4 rounded-xl border p-4 text-center">
                            <p className="mb-2 text-sm font-medium">
                                {TOOL_PRICING_HINTS[TOOL_KEY] || "Free usage limit reached. Upgrade to Pro to continue."}
                            </p>
                            <p className="mb-3 text-xs text-gray-600">One Pro subscription unlocks all tools.</p>
                            <GoProButton />
                        </div>
                    ) : null}

                    <button
                        className="mt-3 inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 disabled:opacity-50"
                        disabled={busy || !file}
                        onClick={() => {
                            setFile(null);
                            setOutSize(null);
                            setError(null);
                            setProgress(null);
                            setUpgradeRequired(false);
                        }}
                    >
                        Clear file
                    </button>
                </div>
            </div>
        </ToolCard>
    );
}
