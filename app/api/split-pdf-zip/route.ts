import { NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";

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

        const chunkRaw = parseInt(String(form.get("chunk") || "5"), 10);
        if (!Number.isFinite(chunkRaw) || chunkRaw < 1) {
            return NextResponse.json({ error: "Invalid chunk size." }, { status: 400 });
        }

        const srcBytes = Buffer.from(await file.arrayBuffer());
        const srcDoc = await PDFDocument.load(srcBytes, { ignoreEncryption: true });
        const totalPages = srcDoc.getPageCount();

        if (totalPages > MAX_PAGES) {
            return NextResponse.json({ error: `PDF too long (max ${MAX_PAGES} pages).` }, { status: 400 });
        }

        const chunk = clamp(chunkRaw, 1, totalPages);

        const base = (file.name || "document").replace(/\.pdf$/i, "");
        const zip = new JSZip();

        let part = 1;
        for (let start = 1; start <= totalPages; start += chunk) {
            const end = Math.min(totalPages, start + chunk - 1);

            // indices are 0-based for copyPages
            const indices = Array.from({ length: end - start + 1 }, (_, i) => (start - 1) + i);

            const outDoc = await PDFDocument.create();
            const pages = await outDoc.copyPages(srcDoc, indices);
            pages.forEach((p) => outDoc.addPage(p));

            const outBytes = await outDoc.save();

            const filename = `${base}_part_${part}_pages_${start}-${end}.pdf`;
            zip.file(filename, outBytes);

            part += 1;
        }

        const zipBytes = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });

        const zipName =
            part <= 2
                ? `${base}_split.zip`
                : `${base}_split_${part - 1}_parts.zip`;

        return new NextResponse(zipBytes, {
            status: 200,
            headers: {
                "Content-Type": "application/zip",
                "Content-Disposition": `attachment; filename="${zipName}"`,
                "Cache-Control": "no-store",
            },
        });
    } catch (err: any) {
        return NextResponse.json(
            { error: "PDF split ZIP failed.", detail: String(err?.message || err) },
            { status: 500 }
        );
    }
}
