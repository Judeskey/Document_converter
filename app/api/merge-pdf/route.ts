import { NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";
import { gateToolOrThrow, recordToolUse } from "@/lib/proGate";

export const runtime = "nodejs";

const MAX_FILES = 20;
const MAX_TOTAL_BYTES = 40 * 1024 * 1024; // 40MB total
const TOOL_KEY = "merge-pdf";

export async function POST(req: Request) {
    // ✅ STEP 1: Gate before doing any heavy work
    const gate = await gateToolOrThrow(TOOL_KEY);
    if (!gate.allowed) {
        return new NextResponse(gate.message, { status: gate.status });
    }

    try {
        const form = await req.formData();
        const files = form.getAll("files").filter((f) => f instanceof File) as File[];

        if (!files.length) {
            return NextResponse.json(
                { error: "Please upload at least 1 PDF file." },
                { status: 400 }
            );
        }
        if (files.length > MAX_FILES) {
            return NextResponse.json(
                { error: `Too many files (max ${MAX_FILES}).` },
                { status: 400 }
            );
        }

        let total = 0;
        for (const f of files) total += f.size;
        if (total > MAX_TOTAL_BYTES) {
            return NextResponse.json(
                { error: "Files too large (max 40MB total)." },
                { status: 400 }
            );
        }

        // Merge
        const merged = await PDFDocument.create();

        for (const f of files) {
            if (f.size <= 0) continue;

            const buf = Buffer.from(await f.arrayBuffer());
            const src = await PDFDocument.load(buf, { ignoreEncryption: true });

            const pages = await merged.copyPages(src, src.getPageIndices());
            for (const p of pages) merged.addPage(p);
        }

        const outBytes = await merged.save();

        // ✅ STEP 2: Record usage only after success
        await recordToolUse(TOOL_KEY);

        return new NextResponse(new Uint8Array(outBytes), {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="merged.pdf"`,
                "Cache-Control": "no-store",
            },
        });
    } catch (err: any) {
        return NextResponse.json(
            { error: "PDF merge failed.", detail: String(err?.message || err) },
            { status: 500 }
        );
    }
}
