import { NextResponse } from "next/server";
import { Document, Packer, Paragraph, TextRun } from "docx";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

import { gateToolOrThrow } from "@/lib/billing/gate";
import { burnToolUsage } from "@/lib/usage/burn";
import { auth } from "@/auth";

const TOOL_KEY = "pdf-to-word-text";

const MAX_PDF_MB = 12;
const MAX_PAGES = 50;
const MAX_TEXT_CHARS = 300_000;

function safeBaseName(filename: string) {
    const base = filename.replace(/\.[^.]+$/, "");
    return base.replace(/[^a-zA-Z0-9-_ ]+/g, "").trim() || "document";
}

function clampText(text: string) {
    if (text.length <= MAX_TEXT_CHARS) return text;
    return text.slice(0, MAX_TEXT_CHARS) + "\n\n[Truncated due to size limits]";
}

export async function POST(req: Request) {
    // 1) Auth + Pro/usage gate (server-side truth)
    const session = await auth();
    const user = session?.user ?? null;

    try {
        await gateToolOrThrow({ user, tool: TOOL_KEY });
    } catch (err: any) {
        if (err instanceof Response) return err;
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2) Read file from multipart/form-data
    const form = await req.formData();
    const file = form.get("file");

    if (!file || !(file instanceof File)) {
        return NextResponse.json(
            { error: "Missing PDF file (field name: file)" },
            { status: 400 }
        );
    }

    if (file.type !== "application/pdf") {
        return NextResponse.json(
            { error: "File must be a PDF" },
            { status: 400 }
        );
    }

    const sizeMb = file.size / (1024 * 1024);
    if (sizeMb > MAX_PDF_MB) {
        return NextResponse.json(
            { error: `PDF too large. Max ${MAX_PDF_MB}MB` },
            { status: 413 }
        );
    }

    const pdfBuf = Buffer.from(await file.arrayBuffer());

    // 3) Extract text (no OCR) – robust ESM/CJS handling
    let parsed: any;
    try {
        const mod: any = await import("pdf-parse");
        const pdfParseFn: any =
            typeof mod === "function" ? mod : mod?.default;

        if (typeof pdfParseFn !== "function") {
            throw new Error("pdf-parse export is not callable");
        }

        parsed = await pdfParseFn(pdfBuf);
    } catch {
        return NextResponse.json(
            { error: "Could not read this PDF (it may be scanned or corrupted)." },
            { status: 422 }
        );
    }

    const numPages = Number(parsed?.numpages ?? 0);
    if (numPages && numPages > MAX_PAGES) {
        return NextResponse.json(
            { error: `Too many pages (${numPages}). Max allowed is ${MAX_PAGES}.` },
            { status: 413 }
        );
    }

    const rawText = String(parsed?.text ?? "").trim();
    if (!rawText) {
        return NextResponse.json(
            { error: "No extractable text found. This PDF may be scanned (OCR required)." },
            { status: 422 }
        );
    }

    const text = clampText(rawText);

    // 4) Build DOCX
    const lines = text.split(/\r?\n/).map((l) => l.trimEnd());

    const doc = new Document({
        sections: [
            {
                properties: {},
                children: lines.map(
                    (line) =>
                        new Paragraph({
                            children: [new TextRun(line || " ")],
                        })
                ),
            },
        ],
    });

    let outBuf: Buffer;
    try {
        outBuf = await Packer.toBuffer(doc);
    } catch {
        return NextResponse.json(
            { error: "Failed to generate DOCX from extracted text." },
            { status: 500 }
        );
    }

    // 5) Burn usage AFTER success (never block download if burn fails)
    burnToolUsage({ user, tool: TOOL_KEY }).catch(() => { });

    const filename = `${safeBaseName(file.name)}.docx`;

    return new Response(new Uint8Array(outBuf), {

        status: 200,
        headers: {
            "Content-Type":
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "Content-Disposition": `attachment; filename="${filename}"`,
            "Cache-Control": "no-store",
        },
    });
}
