import ToolShell from "@/components/ToolShell";
import ToolPageHeader from "@/components/ToolPageHeader";
import ClientOnly from "./ClientOnly";

// ✅ Prevent static prerender (keeps it from trying to prerender at build time)
export const dynamic = "force-dynamic";
export const metadata = {
    title: "Compress PDF Online Free",
    description:
        "Compress PDF files online for free. Reduce PDF size while keeping good quality. Fast, secure, and easy to use.",
};

export default function Page() {
    return (
        <ToolShell>
            <ToolPageHeader
                title="PDF Compress"
                description="Reduce PDF size with lossless or strong compression."
            />
            <ClientOnly />
            <section className="mx-auto mt-12 max-w-5xl px-4">
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                    <h2 className="text-sm font-semibold text-neutral-900">Popular searches</h2>

                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                        <a href="/compress/compress-pdf-online" className="underline">
                            Compress PDF Online
                        </a>
                        <a href="/compress/reduce-pdf-size" className="underline">
                            Reduce PDF Size
                        </a>
                        <a href="/compress/compress-pdf-free" className="underline">
                            Compress PDF Free
                        </a>
                        <a href="/compress/shrink-pdf-file" className="underline">
                            Shrink PDF File
                        </a>
                        <a href="/compress/compress-pdf-for-email" className="underline">
                            Compress PDF for Email
                        </a>
                    </div>
                </div>
            </section>

        </ToolShell>
    );
}
