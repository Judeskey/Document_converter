import ToolShell from "@/components/ToolShell";
import ToolPageHeader from "@/components/ToolPageHeader";
import PdfMergeTool from "@/components/tools/PdfMergeTool";

export const metadata = {
    title: "Merge PDF Online Free",
    description:
        "Merge PDF files online for free. Combine multiple PDFs into one file instantly. Secure and fast.",
};

export default function Page() {
    return (
        <ToolShell>
            <ToolPageHeader
                title="PDF Merge"
                description="Upload multiple PDFs, reorder, merge, and download."
            />

            {/* Main tool */}
            <PdfMergeTool />

            {/* SEO: Internal links to programmatic pages */}
            <section className="mx-auto mt-12 max-w-5xl px-4">
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                    <h2 className="text-sm font-semibold text-neutral-900">
                        Popular searches
                    </h2>

                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                        <a
                            href="/merge-pdf-online"
                            className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-600"
                        >
                            Merge PDF Online
                        </a>

                        <a
                            href="/merge-pdf-free"
                            className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-600"
                        >
                            Merge PDF Free
                        </a>

                        <a
                            href="/merge-pdf-without-watermark"
                            className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-600"
                        >
                            Merge PDF Without Watermark
                        </a>

                        <a
                            href="/merge-pdf-for-mac"
                            className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-600"
                        >
                            Merge PDF for Mac
                        </a>

                        <a
                            href="/merge-pdf-for-windows"
                            className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-600"
                        >
                            Merge PDF for Windows
                        </a>
                    </div>
                </div>
            </section>
        </ToolShell>
    );
}
