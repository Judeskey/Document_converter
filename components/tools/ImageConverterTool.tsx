"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import ToolCard from "@/components/ToolCard";
import UploadCard from "@/components/UploadCard";

type OutFmt = "png" | "jpg" | "webp" | "avif";

type UsageJson = {
    tool: string;
    freeUsed: boolean;
    freeRemaining: number;
};

export default function ImageConverterTool() {
    const [file, setFile] = useState<File | null>(null);
    const [out, setOut] = useState<OutFmt>("png");
    const [busy, setBusy] = useState(false);
    const [msg, setMsg] = useState<string>("");

    // UI-friendly usage state
    const [freeUsed, setFreeUsed] = useState<boolean>(false);
    const [freeRemaining, setFreeRemaining] = useState<number>(0);

    const TOOL_ID = "image-converter";
    const isDev = process.env.NODE_ENV !== "production";

    function onPick(f: File | null) {
        setFile(f);
        setMsg("");
    }

    // UploadCard can send: File | File[] | FileList | input event
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

        if (!res.ok) {
            const text = await res.text().catch(() => "");
            throw new Error(text || `Usage check failed (${res.status})`);
        }

        return (await res.json()) as UsageJson;
    }

    async function burnUsage(): Promise<UsageJson> {
        const res = await fetch(`/api/usage/${TOOL_ID}`, {
            method: "POST",
            credentials: "include",
            headers: { Accept: "application/json" },
        });

        if (!res.ok) {
            const text = await res.text().catch(() => "");
            throw new Error(text || `Usage burn failed (${res.status})`);
        }

        // Your POST currently returns { ok:true, tool }, but parsing is fine either way.
        // If it doesn't return freeRemaining, we'll refresh via GET below.
        const j = await res.json().catch(() => null);
        if (j && typeof j.freeRemaining === "number" && typeof j.freeUsed === "boolean") {
            return j as UsageJson;
        }

        // fallback: re-fetch usage so UI stays correct
        return await getUsage();
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

    // Load per-tool usage on mount
    useEffect(() => {
        refreshUsageUI();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function convertImage() {
        setMsg("");

        if (!file) {
            setMsg("Please choose an image file first.");
            return;
        }

        // ✅ Preflight: check free usage before conversion
        let usage: UsageJson;
        try {
            setMsg("Checking free usage...");
            usage = await getUsage();
            setFreeUsed(Boolean(usage.freeUsed));
            setFreeRemaining(Number(usage.freeRemaining ?? 0));
        } catch (e: any) {
            setMsg(e?.message || "Unable to check usage right now.");
            return;
        }

        if (usage.freeRemaining <= 0) {
            setMsg("Free usage limit reached. Please upgrade to continue using Image Converter.");
            return;
        }

        setBusy(true);

        try {
            const form = new FormData();
            form.append("file", file);
            form.append("out", out);

            const res = await fetch("/api/convert-image", {
                method: "POST",
                body: form,
            });

            if (!res.ok) {
                const j = await res.json().catch(() => null);
                throw new Error(j?.error || `Convert failed (${res.status})`);
            }

            const blob = await res.blob();

            const cd = res.headers.get("content-disposition") || "";
            const match = /filename="([^"]+)"/.exec(cd);
            const filename = match?.[1] || `converted.${out}`;

            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);

            // ✅ Burn usage ONLY after success (do not block download if burn fails)
            try {
                const burned = await burnUsage();
                setFreeUsed(Boolean(burned.freeUsed));
                setFreeRemaining(Number(burned.freeRemaining ?? 0));
            } catch (burnErr) {
                console.error("Usage burn failed:", burnErr);
                // Keep UI consistent anyway
                await refreshUsageUI();
            }

            setMsg("Done ✅ Download started.");
        } catch (e: any) {
            setMsg(e?.message || "Conversion error.");
        } finally {
            setBusy(false);
        }
    }

    async function resetDevOnly() {
        if (!isDev) return;

        setMsg("");
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

            const j = (await res.json().catch(() => null)) as UsageJson | null;
            if (j && typeof j.freeRemaining === "number") {
                setFreeUsed(Boolean(j.freeUsed));
                setFreeRemaining(Number(j.freeRemaining ?? 0));
            } else {
                await refreshUsageUI();
            }

            setMsg("Reset done (dev only).");
        } catch (e: any) {
            setMsg(e?.message || "Reset error.");
        } finally {
            setBusy(false);
        }
    }

    const locked = freeRemaining <= 0;

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
                    disabled={busy}
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
                            disabled={busy}
                        >
                            <option value="png">PNG</option>
                            <option value="jpg">JPG</option>
                            <option value="webp">WebP</option>
                            <option value="avif">AVIF</option>
                        </select>

                        <button
                            onClick={convertImage}
                            disabled={busy || locked}
                            className="mt-4 w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white hover:bg-black disabled:opacity-50"
                        >
                            {busy ? "Converting..." : locked ? "Locked (upgrade)" : "Convert"}
                        </button>

                        {msg ? <div className="mt-3 text-sm text-gray-700">{msg}</div> : null}
                    </div>

                    <div className="rounded-2xl border bg-white p-5">
                        <div className="text-sm font-semibold text-gray-900">Usage (this tool)</div>
                        <div className="mt-2 text-sm text-gray-700">
                            Free used: <span className="font-semibold">{freeUsed ? "Yes" : "No"}</span>
                        </div>
                        <div className="mt-1 text-sm text-gray-700">
                            Free remaining: <span className="font-semibold">{freeRemaining}</span>
                        </div>

                        {isDev ? (
                            <button
                                className="mt-3 inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50"
                                disabled={busy}
                                onClick={resetDevOnly}
                            >
                                Reset (dev only)
                            </button>
                        ) : null}
                    </div>
                </div>
            </div>
        </ToolCard>
    );
}
