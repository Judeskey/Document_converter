"use client";

import { useMemo, useRef, useState } from "react";

type Props = {
    title: string;
    subtitle?: string;
    accept?: string;
    multiple?: boolean;
    disabled?: boolean;
    valueLabel?: string;
    onPick: (files: File[]) => void;
    onClear?: () => void;
};

export default function UploadCard({
    title,
    subtitle,
    accept,
    multiple,
    disabled,
    valueLabel = "No file selected",
    onPick,
    onClear,
}: Props) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [dragOver, setDragOver] = useState(false);

    const hasFile = useMemo(() => {
        return valueLabel && valueLabel !== "No file selected" && valueLabel !== "No PDF selected";
    }, [valueLabel]);

    function openPicker() {
        if (disabled) return;
        inputRef.current?.click();
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files || []);
        if (files.length) onPick(files);

        // allow selecting same file again
        e.currentTarget.value = "";
    }

    function handleDrop(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        if (disabled) return;
        setDragOver(false);

        const files = Array.from(e.dataTransfer.files || []);
        if (files.length) onPick(files);
    }

    return (
        <div
            className={[
                "rounded-2xl border bg-white p-4 sm:p-5",
                disabled ? "opacity-60" : "",
            ].join(" ")}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <div className="text-sm font-semibold">{title}</div>
                    {subtitle ? <div className="mt-1 text-xs text-gray-600">{subtitle}</div> : null}
                </div>

                <button
                    type="button"
                    onClick={openPicker}
                    disabled={disabled}
                    className="shrink-0 rounded-full border px-4 py-2 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50"
                >
                    Choose file
                </button>
            </div>

            {/* Clickable drop area */}
            <div
                className={[
                    "mt-4 rounded-2xl border-2 border-dashed p-5 sm:p-6 transition select-none",
                    disabled ? "cursor-not-allowed" : "cursor-pointer hover:bg-gray-50",
                    dragOver ? "opacity-80" : "",
                ].join(" ")}
                onClick={openPicker}
                onDragOver={(e) => {
                    e.preventDefault();
                    if (!disabled) setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                role="button"
                tabIndex={0}
            >
                <div className="text-xs text-gray-600">Drag & drop here, or click to choose</div>

                <div className="mt-3 rounded-xl border bg-white px-4 py-3 text-sm">
                    <div className="flex items-center justify-between gap-3">
                        <div className="truncate">{valueLabel}</div>

                        {hasFile && onClear ? (
                            <button
                                type="button"
                                className="shrink-0 text-xs font-semibold underline"
                                onClick={(ev) => {
                                    ev.stopPropagation();
                                    onClear?.();
                                }}
                                disabled={disabled}
                            >
                                Remove
                            </button>
                        ) : null}
                    </div>
                </div>

                <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    accept={accept}
                    multiple={multiple}
                    disabled={disabled}
                    onChange={handleChange}
                />
            </div>
        </div>
    );
}
