import Link from "next/link";



type Tool = {
  title: string;
  desc: string;
  href: string;
  badge: string;
  gradient: string;
  icon: string;
};

const FEATURED: Tool[] = [
  {
    title: "Image Converter",
    desc: "PNG / JPG / WebP / AVIF",
    href: "/image/convert",
    badge: "Fast",
    gradient: "from-fuchsia-500 to-pink-500",
    icon: "🖼️",
  },
  {
    title: "PDF Merge",
    desc: "Upload, reorder, merge, download",
    href: "/pdf/merge",
    badge: "Popular",
    gradient: "from-blue-500 to-cyan-500",
    icon: "🧩",
  },
  {
    title: "PDF Split",
    desc: "Split by page, range, or parts",
    href: "/pdf/split",
    badge: "Flexible",
    gradient: "from-emerald-500 to-teal-500",
    icon: "✂️",
  },
  {
    title: "Compress PDF",
    desc: "Reduce PDF size for uploads",
    href: "/pdf/compress",
    badge: "New",
    gradient: "from-orange-500 to-amber-500",
    icon: "🗜️",
  },
  {
    title: "PDF → Word",
    desc: "Headings, lists, page breaks, basic tables",
    href: "/pdf/to-doc",
    badge: "Improved",
    gradient: "from-sky-500 to-blue-600",
    icon: "📄",
  },
  {
    title: "OCR (Scanned PDF)",
    desc: "Scanned PDF → editable Word (DOCX)",
    href: "/pdf/ocr",
    badge: "Pro",
    gradient: "from-rose-500 to-red-500",
    icon: "🔎",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {/* Top nav */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 text-white font-bold">
              D
            </div>
            <div className="text-sm font-semibold text-gray-900">DocConvert</div>
          </div>

          <div className="flex items-center gap-2">
            
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black"
            >
              View all tools →
            </Link>
        
          </div>
        </div>

        {/* Hero */}
        <div className="mt-8 rounded-3xl border bg-gradient-to-br from-gray-50 to-white p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs font-semibold">
                ✅ Free to try • Feature-first MVP
              </div>

              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-gray-900">
                Free Online Document and Image Converter
              </h1>

              <p className="mt-3 text-base text-gray-600">
                Convert images and PDFs instantly — fast, secure, and free to try.
                Upgrade anytime for unlimited conversions.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <Link
                  href="/tools"
                  className="rounded-full bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-black"
                >
                  Browse tools
                </Link>
                <Link
                  href="/pdf/merge"
                  className="rounded-full border px-5 py-2.5 text-sm font-semibold hover:bg-gray-50"
                >
                  Try PDF Merge →
                </Link>
              </div>

              <div className="mt-5 flex flex-wrap gap-2 text-xs text-gray-600">
                <span className="rounded-full border bg-white px-3 py-1">No signup for MVP</span>
                <span className="rounded-full border bg-white px-3 py-1">Runs in your browser</span>
                <span className="rounded-full border bg-white px-3 py-1">Fast downloads</span>
              </div>
            </div>

            {/* Decorative side card */}
            <div className="relative overflow-hidden rounded-3xl border bg-white p-5 sm:w-[360px]">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 opacity-15 blur-2xl" />
              <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 opacity-15 blur-2xl" />

              <div className="relative">
                <div className="text-sm font-semibold text-gray-900">Quick start</div>
                <p className="mt-1 text-sm text-gray-600">
                  Pick a tool, upload a file, and download instantly.
                </p>

                <div className="mt-4 grid gap-2">
                  <Link
                    href="/image/convert"
                    className="rounded-2xl border px-4 py-3 text-sm font-semibold hover:bg-gray-50"
                  >
                    🖼️ Convert an image
                  </Link>
                  <Link
                    href="/pdf/compress"
                    className="rounded-2xl border px-4 py-3 text-sm font-semibold hover:bg-gray-50"
                  >
                    🗜️ Compress a PDF
                  </Link>
                  <Link
                    href="/pdf/ocr"
                    className="rounded-2xl border px-4 py-3 text-sm font-semibold hover:bg-gray-50"
                  >
                    🔎 OCR a scanned PDF
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured tools grid */}
        <div className="mt-10 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Popular tools</h2>
            <p className="mt-1 text-sm text-gray-600">
              Start with these — they cover most everyday needs.
            </p>
          </div>

          <Link
            href="/tools"
            className="hidden sm:inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold hover:bg-gray-50"
          >
            See all →
          </Link>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {FEATURED.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="group relative overflow-hidden rounded-2xl border bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div
                className={[
                  "absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-20 blur-2xl",
                  "bg-gradient-to-br",
                  t.gradient,
                ].join(" ")}
              />

              <div className="relative flex items-start gap-4">
                <div
                  className={[
                    "flex h-12 w-12 items-center justify-center rounded-2xl text-xl",
                    "bg-gradient-to-br text-white shadow-sm",
                    t.gradient,
                  ].join(" ")}
                >
                  {t.icon}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-base font-bold text-gray-900">{t.title}</h3>
                    <span className="rounded-full border bg-gray-50 px-2 py-0.5 text-xs font-semibold text-gray-700">
                      {t.badge}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{t.desc}</p>

                  <div className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-gray-900">
                    Open tool <span className="transition group-hover:translate-x-0.5">→</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom hint */}
        <div className="mt-10 rounded-2xl border bg-gray-50 p-5 text-sm text-gray-700">
          <div className="font-semibold">Tip</div>
          <div className="mt-1">
            If a PDF looks scanned (no selectable text), use{" "}
            <Link href="/pdf/ocr" className="underline font-semibold">
              OCR (Scanned PDF)
            </Link>{" "}
            for best results.
          </div>
        </div>
      </div>
    </main>
  );
}
