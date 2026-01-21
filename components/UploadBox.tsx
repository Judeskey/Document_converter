"use client";

import { useMemo, useRef, useState } from "react";

type Props = {
    title: string;
    helper?: string;
    accept?: string;
    multiple?: boolean;
    disabled?: boolean;
    summaryText?: string;
    onFiles: (files: File[]) => void;
    onClear?: () => void;
};

export default function UploadBox({
    title,
    helper,
    accept,
    multiple,
    disabled,
    summaryText,
    onFiles,
    onClear,
}: Props) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [dragOver, setDragOver] = useState(false);

    const canClear = Boolean(onClear) && Boolean(summaryText);

    function handlePick() {
        if (disabled) return;
        inputRef.current?.click();
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files || []);
        if (files.length) onFiles(files);

        // allow picking the same file again
        e.currentTarget.value = "";
    }

    function handleDrop(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        if (disabled) return;
        setDragOver(false);

        const files = Array.from(e.dataTransfer.files || []);
        if (files.length) onFiles(files);
    }

    const boxClass = useMemo(() => {
        return [
            "rounded-2xl border-2 border-dashed bg-white p-5 sm:p-6 transition",
            dragOver ? "opacity-80" : "",
            disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:bg-gray-50",
        ].join(" ");
    }, [dragOver, disabled]);

    return (
        <div
            className={boxClass}
            onClick={handlePick}
            onDragOver={(e) => {
                e.preventDefault();
                if (!disabled) setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            role="button"
            tabIndex={0}
        >
            <div className="text-sm font-semibold">{title}</div>
            {helper ? <div className="mt-1 text-xs text-gray-600">{helper}</div> : null}

            <div className="mt-4 rounded-xl border bg-white px-4 py-3 text-sm">
                {summaryText ? (
                    <div className="flex items-center justify-between gap-3">
                        <div className="truncate">{summaryText}</div>
                        {canClear ? (
                            <button
                                type="button"
                                className="shrink-0 text-xs font-medium underline"
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
                ) : (
                    <div className="text-gray-500">Click to choose a file</div>
                )}
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
    );
}
