import { NextResponse } from "next/server";
import sharp from "sharp";

export const runtime = "nodejs"; // sharp requires Node runtime

const MAX_BYTES = 15 * 1024 * 1024; // 15MB

function sanitizeOutExt(ext: string) {
  const e = String(ext || "").toLowerCase().trim();
  const allowed = ["png", "jpeg", "jpg", "webp", "avif"];
  if (!allowed.includes(e)) return null;
  return e === "jpg" ? "jpeg" : e;
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const file = form.get("file");
    const out = sanitizeOutExt(String(form.get("out") || ""));

    if (!out) {
      return NextResponse.json(
        { error: "Invalid output format." },
        { status: 400 }
      );
    }

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "Missing file." },
        { status: 400 }
      );
    }

    if (file.size <= 0) {
      return NextResponse.json(
        { error: "Empty file." },
        { status: 400 }
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "File too large (max 15MB)." },
        { status: 400 }
      );
    }

    const inName = file.name || "upload";
    const inBase = inName.replace(/\.[^/.]+$/, "");
    const buf = Buffer.from(await file.arrayBuffer());

    let pipeline = sharp(buf, { failOn: "none" });

    // output settings
    if (out === "jpeg") pipeline = pipeline.jpeg({ quality: 85 });
    if (out === "png") pipeline = pipeline.png({ compressionLevel: 9 });
    if (out === "webp") pipeline = pipeline.webp({ quality: 85 });
    if (out === "avif") pipeline = pipeline.avif({ quality: 50 });

    const outBuf = await pipeline.toBuffer();

    const outName = `${inBase}.${out === "jpeg" ? "jpg" : out}`;
    const contentType =
      out === "jpeg" ? "image/jpeg" :
        out === "png" ? "image/png" :
          out === "webp" ? "image/webp" :
            "image/avif";

    // ✅ FIX: Buffer → Uint8Array (Next.js 16 compliant)

    const body = new Uint8Array(outBuf);

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${outName}"`,
        "Cache-Control": "no-store",
      },
    });


  } catch (err: any) {
    return NextResponse.json(
      { error: "Conversion failed.", detail: String(err?.message || err) },
      { status: 500 }
    );
  }
}
