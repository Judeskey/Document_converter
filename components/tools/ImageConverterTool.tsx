"use client";

import { useMemo, useState, useCallback } from "react";
import ToolCard from "@/components/ToolCard";
import UploadCard from "@/components/UploadCard";
import GoProButton from "@/components/GoProButton";
import { TOOL_PRICING_HINTS } from "@/lib/tools/pricingHints";
import { TOOL_IDS } from "@/lib/tools/toolIds";

type OutFmt = "png" | "jpg" | "webp" | "avif";

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

export default function ImageConverterTool() {
    const TOOL_ID = TOOL_IDS.imageConverter; // ✅ canonical id used by /api/usage/[tool]
    const TOOL_KEY = TOOL_ID; // ✅ pricing hints key should match canonical tool id

    const [file, setFile] = useState<File | null>(null);
    const [out, setOut] = useState<OutFmt>("png");
    const [busy, setBusy] = useState(false);
    const [msg, setMsg] = useState<string>("");

    // ✅ gating/usage UI
    const [blocked, setBlocked] = useState(false);
    const [gateBusy, setGateBusy] = useState(false);
    const [freeRemaining, setFreeRemaining] = useState<number>(0);
    const [isPro, setIsPro] = useState<boolean>(false);

    function onPick(f: File | null) {
        setFile(f);
        setMsg("");
        setBlocked(false);
    }

    // UploadCard may send: File | File[] | FileList | input event
    const pickFirstFile = useCallback((input: any): File | null => {
        if (!input) return null;
        if (Array.isArray(input)) return input[0] ?? null;
        if (typeof File !== "undefined" && input instanceof File) return input;
        if (typeof FileList !== "undefined" && input instanceof FileList) return input[0] ?? null;

        const files = input?.target?.files;
        if (typeof FileList !== "undefined" && files instanceof FileList) return files[0] ?? null;

        if (Array.isArray(input?.files)) return input.files[0] ?? null;

        return null;
    }, []);

    const onUploadPick = useCallback(
        (input: any) => {
            const f = pickFirstFile(input);
            onPick(f);
        },
        [pickFirstFile]
    );

    const fileLabel = useMemo(() => {
        if (!file) return "No file selected";
        const kb = Math.round(file.size / 1024);
        return `${file.name} (${kb} KB)`;
    }, [file]);

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

    async function checkAllowed(): Promise<boolean> {
        setGateBusy(true);
        setMsg("");
        setBlocked(false);

        try {
            const usage = await getUsage();
            const pro = Boolean(usage.isPro);
            const remaining = Number(usage.freeRemaining ?? 0);

            setIsPro(pro);
            setFreeRemaining(remaining);

            // ✅ allowed if Pro OR remaining > 0
            if (pro || remaining > 0) return true;

            setBlocked(true);
            setMsg("Free trial used for this tool. Upgrade to Pro to continue.");
            return false;
        } catch (e: any) {
            setMsg(e?.message || "Unable to check access right now.");
            return false;
        } finally {
            setGateBusy(false);
        }
    }

    async function convertImage() {
        setMsg("");
        setBlocked(false);

        if (!file) {
            setMsg("Please choose an image file first.");
            return;
        }

        const allowed = await checkAllowed();
        if (!allowed) return;

        setBusy(true);
        try {
            const form = new FormData();
            form.append("file", file);
            form.append("out", out);

            const res = await fetch("/api/convert-image", {
                method: "POST",
                body: form,
            });

            if (!res.ok) throw new Error(await readErrorMessage(res));

            // ✅ download first (don’t block download if burn fails)
            await downloadFromResponse(res, `converted.${out}`);

            // ✅ burn usage ONLY if not Pro
            if (!isPro) {
                try {
                    await burnUsage();
                    // refresh UI counters (best-effort)
                    const u2 = await getUsage().catch(() => null);
                    if (u2) {
                        setIsPro(Boolean(u2.isPro));
                        setFreeRemaining(Number(u2.freeRemaining ?? 0));
                    }
                } catch {
                    // ignore burn failure
                }
            }

            setMsg("Done ✅ Download started.");
        } catch (e: any) {
            setMsg(e?.message || "Conversion error.");
        } finally {
            setBusy(false);
        }
    }

    return (
        <ToolCard
            title="Image Converter"
            subtitle="Convert images instantly (PNG / JPG / WebP / AVIF)."
            badge="Fast"
            gradient="from-fuchsia-500 to-pink-500"
            icon="🖼️"
        >
            <div className="grid gap-4">
                <UploadCard
                    title="Upload an image"
                    subtitle="Drag & drop an image here, or click to choose."
                    accept="image/*,.png,.jpg,.jpeg,.webp,.avif"
                    disabled={busy || gateBusy}
                    valueLabel={fileLabel}
                    onPick={onUploadPick}
                    onClear={() => onPick(null)}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border bg-white p-5">
                        <label className="text-sm font-semibold text-gray-900">Convert to</label>
                        <select
                            value={out}
                            onChange={(e) => setOut(e.target.value as OutFmt)}
                            className="mt-2 w-full rounded-xl border px-3 py-2 text-sm"
                            disabled={busy || gateBusy}
                        >
                            <option value="png">PNG</option>
                            <option value="jpg">JPG</option>
                            <option value="webp">WebP</option>
                            <option value="avif">AVIF</option>
                        </select>

                        <button
                            onClick={convertImage}
                            disabled={busy || gateBusy}
                            className="mt-4 w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white hover:bg-black disabled:opacity-50"
                        >
                            {busy ? "Converting..." : gateBusy ? "Checking access..." : "Convert"}
                        </button>

                        {/* Optional: show remaining uses for free users */}
                        {!isPro ? (
                            <div className="mt-3 text-xs text-gray-600">
                                Free remaining: <span className="font-semibold">{freeRemaining}</span>
                            </div>
                        ) : (
                            <div className="mt-3 text-xs text-gray-600">
                                Plan: <span className="font-semibold">PRO</span> (unlimited)
                            </div>
                        )}

                        {blocked ? (
                            <div className="mt-4 rounded-xl border p-4 text-center">
                                <p className="mb-2 text-sm font-medium">
                                    {TOOL_PRICING_HINTS[TOOL_KEY] ?? "Upgrade to Pro to unlock unlimited usage."}
                                </p>
                                <p className="mb-3 text-xs text-gray-600">One subscription unlocks all tools.</p>
                                <GoProButton />
                            </div>
                        ) : null}

                        {msg ? <div className="mt-3 text-sm text-gray-700">{msg}</div> : null}
                    </div>

                    <div className="rounded-2xl border bg-white p-5">
                        <div className="text-sm font-semibold text-gray-900">Tip</div>
                        <div className="mt-2 text-sm text-gray-700">
                            Pro users get unlimited conversions across all tools.
                        </div>
                    </div>
                </div>
            </div>
        </ToolCard>
    );
}
