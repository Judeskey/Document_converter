"use client";

import { useMemo, useState } from "react";
import {
    AlignmentType,
    Document,
    HeadingLevel,
    LevelFormat,
    Packer,
    Paragraph,
    Table,
    TableCell,
    TableRow,
    TextRun,
    WidthType,
} from "docx";
import { saveAs } from "file-saver";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf";
import ToolCard from "@/components/ToolCard";
import UploadCard from "@/components/UploadCard";

(pdfjs as any).GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/legacy/build/pdf.worker.mjs",
    import.meta.url
).toString();

type ListKind = "bullet" | "numbered" | null;

type TextItem = {
    str: string;
    transform?: number[];
    width?: number;
    height?: number;
};

function firstFile(input: unknown): File | null {
    if (!input) return null;

    // File[]
    if (Array.isArray(input)) {
        const f = input[0];
        return f instanceof File ? f : null;
    }

    // File
    if (input instanceof File) return input;

    // FileList
    if (typeof FileList !== "undefined" && input instanceof FileList) {
        const f = input.item(0);
        return f ?? null;
    }

    // Change/Drop event: e.target.files
    const maybeFiles = (input as any)?.target?.files;
    if (typeof FileList !== "undefined" && maybeFiles instanceof FileList) {
        const f = maybeFiles.item(0);
        return f ?? null;
    }

    // Some components pass { files: File[] }
    const arr = (input as any)?.files;
    if (Array.isArray(arr) && arr[0] instanceof File) return arr[0];

    return null;
}

function clean(s: string) {
    return s.replace(/\s+/g, " ").trim();
}

function isBulletLine(s: string) {
    return /^(\u2022|•|-|–|—|·|\*)\s+/.test(s);
}

function isNumberedLine(s: string) {
    return /^(\d+[\.\)\-]|[a-zA-Z][\.\)]|[ivxlcdmIVXLCDM]+[\.\)])\s+/.test(s);
}

function stripListMarker(s: string) {
    return s.replace(
        /^(\u2022|•|-|–|—|·|\*|\d+[\.\)\-]|[a-zA-Z][\.\)]|[ivxlcdmIVXLCDM]+[\.\)])\s+/,
        ""
    );
}

function inferListKind(line: string): ListKind {
    if (isBulletLine(line)) return "bullet";
    if (isNumberedLine(line)) return "numbered";
    return null;
}

function fontSizeProxy(it: TextItem): number {
    const t = it.transform;
    if (t && t.length >= 4) return Math.abs(t[3]) || 0;
    return (it.height as number) || 0;
}

function getXY(it: TextItem) {
    const t = it.transform;
    if (t && t.length >= 6) return { x: t[4] || 0, y: t[5] || 0 };
    return { x: 0, y: 0 };
}

function median(nums: number[]) {
    if (!nums.length) return 0;
    const a = [...nums].sort((x, y) => x - y);
    const mid = Math.floor(a.length / 2);
    return a.length % 2 ? a[mid] : (a[mid - 1] + a[mid]) / 2;
}

/** Simple column split by X gaps (table detection) */
function splitIntoColumns(tokens: { text: string; x: number }[], gap = 40) {
    if (!tokens.length) return [];
    const cols: string[] = [];
    let buf: string[] = [tokens[0].text];
    let prevX = tokens[0].x;

    for (let i = 1; i < tokens.length; i++) {
        const t = tokens[i];
        if (t.x - prevX > gap) {
            cols.push(clean(buf.join(" ")));
            buf = [t.text];
        } else {
            buf.push(t.text);
        }
        prevX = t.x;
    }
    cols.push(clean(buf.join(" ")));
    return cols.filter(Boolean);
}

function makeDocxTable(rows: string[][]) {
    const tableRows = rows.map(
        (r) =>
            new TableRow({
                children: r.map(
                    (cellText) =>
                        new TableCell({
                            width: {
                                size: 100 / Math.max(1, r.length),
                                type: WidthType.PERCENTAGE,
                            },
                            children: [new Paragraph(clean(cellText) || "")],
                        })
                ),
            })
    );

    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: tableRows,
    });
}

export default function PdfToDocTool() {
    const [file, setFile] = useState<File | null>(null);
    const [busy, setBusy] = useState(false);
    const [msg, setMsg] = useState("");
    const [warning, setWarning] = useState("");

    const [maxPages, setMaxPages] = useState("50");
    const [tryTables, setTryTables] = useState(true);

    const fileLabel = useMemo(() => {
        if (!file) return "No PDF selected";
        const kb = Math.round(file.size / 1024);
        return `${file.name} (${kb} KB)`;
    }, [file]);

    const TOOL_ID = "pdf-to-word";

    async function getUsage() {
        const res = await fetch(`/api/usage/${TOOL_ID}`, {
            method: "GET",
            credentials: "include",
            headers: { Accept: "application/json" },
        });

        if (!res.ok) {
            const text = await res.text().catch(() => "");
            throw new Error(text || `Usage check failed (${res.status})`);
        }

        return (await res.json()) as {
            tool: string;
            freeUsed: boolean;
            freeRemaining: number;
        };
    }

    async function burnUsage() {
        const res = await fetch(`/api/usage/${TOOL_ID}`, {
            method: "POST",
            credentials: "include",
            headers: { Accept: "application/json" },
        });

        if (!res.ok) {
            const text = await res.text().catch(() => "");
            throw new Error(text || `Usage burn failed (${res.status})`);
        }

        return (await res.json()) as {
            tool: string;
            freeUsed: boolean;
            freeRemaining: number;
        };
    }

    async function convert() {
        setMsg("");
        setWarning("");

        if (!file) {
            setMsg("Please choose a PDF first.");
            return;
        }

        const maxP = parseInt(maxPages || "50", 10);
        if (!Number.isFinite(maxP) || maxP < 1 || maxP > 200) {
            setMsg("Max pages must be between 1 and 200.");
            return;
        }

        // ✅ Preflight: check free usage before doing heavy work
        try {
            setMsg("Checking free usage...");
            const usage = await getUsage();

            if (usage.freeRemaining <= 0) {
                setMsg("Free usage limit reached. Please upgrade to continue using PDF → Word.");
                return;
            }
        } catch (e: any) {
            setMsg(e?.message || "Unable to check usage right now.");
            return;
        }

        setBusy(true);

        try {
            const bytes = new Uint8Array(await file.arrayBuffer());
            const pdf = await (pdfjs as any).getDocument({ data: bytes }).promise;

            const totalPages: number = pdf.numPages;
            const pagesToRead = Math.min(totalPages, maxP);

            // ✅ Real numbered list config
            const NUMBERING_REF = "num-list";
            const docChildren: (Paragraph | Table)[] = [];

            // Title
            docChildren.push(
                new Paragraph({
                    children: [new TextRun({ text: `Converted from: ${file.name}`, bold: true })],
                    spacing: { after: 240 },
                })
            );

            let totalExtractedChars = 0;

            for (let p = 1; p <= pagesToRead; p++) {
                setMsg(`Reading page ${p} of ${pagesToRead}...`);

                const page = await pdf.getPage(p);
                const content = await page.getTextContent();

                const items: TextItem[] = (content.items as any[])
                    .map((it) => ({
                        str: typeof it.str === "string" ? it.str : "",
                        transform: it.transform,
                        width: it.width,
                        height: it.height,
                    }))
                    .filter((it) => clean(it.str).length > 0);

                const pageChars = items.reduce((sum, it) => sum + clean(it.str).length, 0);
                totalExtractedChars += pageChars;

                // Heuristic: scanned/no selectable text
                if (pageChars < 15) {
                    docChildren.push(
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: `(Page ${p}: little or no selectable text detected)`,
                                    italics: true,
                                }),
                            ],
                            spacing: { after: 120 },
                        })
                    );
                    if (p < pagesToRead) {
                        docChildren.push(new Paragraph({ children: [new TextRun("")], pageBreakBefore: true }));
                    }
                    continue;
                }

                // Heading detection baseline
                const sizes = items.map(fontSizeProxy).filter((n) => n > 0);
                const med = median(sizes);

                // Build lines by Y grouping
                const withPos = items.map((it) => ({ it, ...getXY(it) }));
                withPos.sort((a, b) => b.y - a.y || a.x - b.x);

                const yTol = 2.5;
                const lines: { y: number; items: { it: TextItem; x: number; y: number }[] }[] = [];

                for (const cur of withPos) {
                    const last = lines[lines.length - 1];
                    if (!last || Math.abs(last.y - cur.y) > yTol) {
                        lines.push({ y: cur.y, items: [cur] });
                    } else {
                        last.items.push(cur);
                    }
                }

                // Convert lines to structured line objects
                const lineObjs = lines
                    .map((ln) => {
                        const sorted = [...ln.items].sort((a, b) => a.x - b.x);

                        const tokens = sorted
                            .map((t) => ({ text: clean(t.it.str), x: t.x }))
                            .filter((t) => t.text.length > 0);

                        const text = clean(tokens.map((t) => t.text).join(" "));
                        const fs = median(sorted.map((t) => fontSizeProxy(t.it)).filter((n) => n > 0));

                        const cols = tryTables ? splitIntoColumns(tokens, 40) : [];

                        return { text, fontSize: fs, cols };
                    })
                    .filter((l) => l.text.length > 0);

                // ✅ Detect simple table blocks: consecutive lines with >=2 columns
                const tableRows: string[][] = [];
                let inTable = false;

                const flushTableIfAny = () => {
                    if (tableRows.length >= 2) {
                        docChildren.push(makeDocxTable(tableRows));
                        docChildren.push(new Paragraph("")); // spacing after table
                    } else if (tableRows.length === 1) {
                        docChildren.push(new Paragraph(tableRows[0].join("  ")));
                        docChildren.push(new Paragraph(""));
                    }
                    tableRows.length = 0;
                    inTable = false;
                };

                const isShort = (t: string) => t.length <= 80;

                for (const ln of lineObjs) {
                    const line = ln.text;
                    const fs = ln.fontSize || 0;

                    const listKind = inferListKind(line);
                    const listText = listKind ? stripListMarker(line) : line;

                    // Heading inference
                    let heading: HeadingLevel | null = null;
                    if (med > 0) {
                        if (fs >= med * 1.8 && isShort(line)) heading = HeadingLevel.HEADING_1;
                        else if (fs >= med * 1.45 && isShort(line)) heading = HeadingLevel.HEADING_2;
                        else if (fs >= med * 1.25 && isShort(line)) heading = HeadingLevel.HEADING_3;
                    }

                    const looksLikeTableLine = tryTables && ln.cols.length >= 2 && ln.cols.length <= 6;

                    // If heading/list, it breaks table mode
                    if (heading || listKind) {
                        flushTableIfAny();

                        if (heading) {
                            docChildren.push(
                                new Paragraph({
                                    heading,
                                    children: [new TextRun({ text: clean(line) })],
                                    spacing: { after: 180 },
                                })
                            );
                            continue;
                        }

                        if (listKind === "bullet") {
                            docChildren.push(
                                new Paragraph({
                                    children: [new TextRun({ text: clean(listText) })],
                                    bullet: { level: 0 },
                                })
                            );
                            continue;
                        }

                        // ✅ Real numbered list
                        if (listKind === "numbered") {
                            docChildren.push(
                                new Paragraph({
                                    children: [new TextRun({ text: clean(listText) })],
                                    numbering: { reference: NUMBERING_REF, level: 0 },
                                })
                            );
                            continue;
                        }
                    }

                    // Table block handling
                    if (looksLikeTableLine) {
                        inTable = true;
                        tableRows.push(ln.cols.map(clean));
                        continue;
                    }

                    // leaving table
                    if (inTable) flushTableIfAny();

                    // Normal paragraph
                    docChildren.push(new Paragraph(clean(line)));
                }

                // End of page flush tables
                flushTableIfAny();

                // ✅ Page breaks
                if (p < pagesToRead) {
                    docChildren.push(new Paragraph({ children: [new TextRun("")], pageBreakBefore: true }));
                }
            }

            // ✅ Automatic scanned warning
            const avgCharsPerPage = totalExtractedChars / Math.max(1, pagesToRead);
            if (avgCharsPerPage < 60) {
                setWarning("This PDF looks like it may be scanned (very little selectable text). For best results, use OCR.");
            }

            setMsg("Building DOCX...");

            const doc = new Document({
                numbering: {
                    config: [
                        {
                            reference: NUMBERING_REF,
                            levels: [
                                {
                                    level: 0,
                                    format: LevelFormat.DECIMAL,
                                    text: "%1.",
                                    alignment: AlignmentType.START,
                                },
                            ],
                        },
                    ],
                },
                sections: [{ properties: {}, children: docChildren }],
            });

            const blob = await Packer.toBlob(doc);

            // ✅ Burn usage only after successful conversion (do not block download if burn fails)
            try {
                await burnUsage();
            } catch (burnErr) {
                console.error("Usage burn failed:", burnErr);
            }

            const base = file.name.replace(/\.pdf$/i, "");
            const outName = `${base}.docx`;
            saveAs(blob, outName);

            setMsg(
                totalPages > pagesToRead
                    ? `Done ✅ Download started. Converted first ${pagesToRead} of ${totalPages} pages.`
                    : `Done ✅ Download started: ${outName}`
            );
        } catch (e: any) {
            setMsg(e?.message || "PDF → DOCX failed.");
        } finally {
            setBusy(false);
        }
    }

    return (
        <ToolCard
            title="PDF → Word"
            subtitle="Better DOCX: headings, bullets, numbered lists, page breaks, basic tables."
            badge="Improved"
            gradient="from-sky-500 to-blue-600"
            icon="📄"
        >
            <div className="grid gap-4">
                <UploadCard
                    title="Upload a PDF"
                    subtitle="Drag & drop a PDF here, or click to choose"
                    accept="application/pdf,.pdf"
                    disabled={busy}
                    valueLabel={file ? file.name : "No PDF selected"}
                    onPick={(input) => {
                        const f = firstFile(input);
                        console.log("UploadCard → resolved file:", f);
                        setFile(f);
                    }}
                    onClear={() => setFile(null)}
                />

                <div className="rounded-2xl border bg-white p-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="text-sm font-semibold">Max pages</label>
                            <input
                                className="mt-2 w-full rounded-xl border bg-white px-3 py-2 text-sm"
                                value={maxPages}
                                onChange={(e) => setMaxPages(e.target.value)}
                                inputMode="numeric"
                                disabled={busy}
                            />
                            <div className="mt-1 text-xs text-gray-600">1–200 (default 50)</div>
                        </div>

                        <div className="flex items-end">
                            <label className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4"
                                    checked={tryTables}
                                    onChange={(e) => setTryTables(e.target.checked)}
                                    disabled={busy}
                                />
                                <span className="font-semibold">Try basic tables</span>
                            </label>
                        </div>
                    </div>

                    {warning ? (
                        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                            ⚠️ {warning}
                        </div>
                    ) : null}

                    <button
                        type="button"
                        className="mt-5 w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white hover:bg-black disabled:opacity-50"
                        onClick={() => {
                            console.log("Convert button clicked. file=", file);
                            convert();
                        }}
                        disabled={!file || busy}
                    >
                        {busy ? "Converting..." : "Convert → DOCX & Download"}
                    </button>

                    {msg ? <div className="mt-3 text-sm text-gray-800">{msg}</div> : null}
                </div>
            </div>
        </ToolCard>
    );
}
