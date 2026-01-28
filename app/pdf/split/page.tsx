import ToolShell from "@/components/ToolShell";
import ToolPageHeader from "@/components/ToolPageHeader";
import PdfSplitTool from "@/components/tools/PdfSplitTool";
export const metadata = {
    title: "Split PDF Online Free",
    description:
        "Split a PDF into pages or ranges online for free. Fast, secure, and easy to use.",
};

export default function Page() {
    return (
        <ToolShell>
            <ToolPageHeader
                title="PDF Split"
                description="Split by single page, range, or split into parts."
            />
            <PdfSplitTool />
            <section className="mx-auto mt-12 max-w-5xl px-4">
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                    <h2 className="text-sm font-semibold text-neutral-900">
                        Popular searches
                    </h2>

                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                        <a href="/split/split-pdf-online" className="underline">
                            Split PDF Online
                        </a>
                        <a href="/split/split-pdf-free" className="underline">
                            Split PDF Free
                        </a>
                        <a href="/split/split-pdf-by-page" className="underline">
                            Split PDF by Page
                        </a>
                        <a href="/split/split-pdf-by-range" className="underline">
                            Split PDF by Range
                        </a>
                        <a href="/split/extract-pages-from-pdf" className="underline">
                            Extract Pages from PDF
                        </a>
                    </div>
                </div>
            </section>

        </ToolShell>
    );
}
