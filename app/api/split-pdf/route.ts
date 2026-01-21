import { NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";

export const runtime = "nodejs";

const MAX_BYTES = 40 * 1024 * 1024; // 40MB
const MAX_PAGES = 400;

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
}

export async function POST(req: Request) {
    try {
        const form = await req.formData();

        const file = form.get("file");
        if (!file || !(file instanceof File)) {
            return NextResponse.json({ error: "Missing PDF file." }, { status: 400 });
        }
        if (file.size <= 0) {
            return NextResponse.json({ error: "Empty file." }, { status: 400 });
        }
        if (file.size > MAX_BYTES) {
            return NextResponse.json({ error: "File too large (max 40MB)." }, { status: 400 });
        }

        const mode = String(form.get("mode") || "range"); // range | page
        const startRaw = parseInt(String(form.get("start") || "1"), 10);
        const endRaw = parseInt(String(form.get("end") || "1"), 10);

        const srcBytes = Buffer.from(await file.arrayBuffer());
        const srcDoc = await PDFDocument.load(srcBytes, { ignoreEncryption: true });

        const totalPages = srcDoc.getPageCount();
        if (totalPages > MAX_PAGES) {
            return NextResponse.json({ error: `PDF too long (max ${MAX_PAGES} pages).` }, { status: 400 });
        }

        // Convert to 0-based indices
        let start = clamp(isNaN(startRaw) ? 1 : startRaw, 1, totalPages) - 1;
        let end = clamp(isNaN(endRaw) ? 1 : endRaw, 1, totalPages) - 1;

        if (mode === "page") {
            start = clamp(startRaw || 1, 1, totalPages) - 1;
            end = start;
        } else {
            // range mode
            if (end < start) [start, end] = [end, start];
        }

        const outDoc = await PDFDocument.create();
        const indices = Array.from({ length: end - start + 1 }, (_, i) => start + i);

        const pages = await outDoc.copyPages(srcDoc, indices);
        pages.forEach((p) => outDoc.addPage(p));

        const outBytes = await outDoc.save();

        const baseName = (file.name || "document").replace(/\.pdf$/i, "");
        const outName =
            mode === "page"
                ? `${baseName}_page_${start + 1}.pdf`
                : `${baseName}_pages_${start + 1}-${end + 1}.pdf`;

        return new NextResponse(Buffer.from(outBytes), {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="${outName}"`,
                "Cache-Control": "no-store",
            },
        });
    } catch (err: any) {
        return NextResponse.json(
            { error: "PDF split failed.", detail: String(err?.message || err) },
            { status: 500 }
        );
    }
}
