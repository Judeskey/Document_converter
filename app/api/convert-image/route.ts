import { NextResponse } from "next/server";
import sharp from "sharp";
import { gateToolOrThrow, recordToolUse } from "@/lib/proGate";

export const runtime = "nodejs"; // sharp requires Node runtime

const MAX_BYTES = 15 * 1024 * 1024; // 15MB
const TOOL_KEY = "image-convert";

function sanitizeOutExt(ext: string) {
  const e = String(ext || "").toLowerCase().trim();
  const allowed = ["png", "jpeg", "jpg", "webp", "avif"];
  if (!allowed.includes(e)) return null;
  return e === "jpg" ? "jpeg" : e;
}

export async function POST(req: Request) {
  // ✅ STEP 1: Gate the tool BEFORE doing work
  const gate = await gateToolOrThrow(TOOL_KEY);
  if (!gate.allowed) {
    return new NextResponse(gate.message, { status: gate.status });
  }

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

    const body = new Uint8Array(outBuf);

    // ✅ STEP 2: Record usage ONLY after successful conversion
    await recordToolUse(TOOL_KEY);

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
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
