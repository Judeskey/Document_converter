import ToolShell from "@/components/ToolShell";
import ToolPageHeader from "@/components/ToolPageHeader";
import ImageConvertTool from "@/components/tools/ImageConverterTool";

export const metadata = {
    title: "Image Converter Online Free",
    description:
        "Convert images online for free. Change PNG, JPG, WebP, AVIF and more instantly. Secure and fast.",
};

export default function Page() {
    return (
        <ToolShell>
            <ToolPageHeader
                title="Image Converter"
                description="Convert PNG / JPG / WebP / AVIF and more. Upload, convert, and download."
            />

            {/* Main tool */}
            <ImageConvertTool />

            {/* SEO: Internal links to programmatic pages */}
            <section className="mx-auto mt-12 max-w-5xl px-4">
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                    <h2 className="text-sm font-semibold text-neutral-900">
                        Popular searches
                    </h2>

                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                        <a
                            href="/image/convert-image-online"
                            className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-600"
                        >
                            Convert Image Online
                        </a>

                        <a
                            href="/image/image-converter-free"
                            className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-600"
                        >
                            Image Converter Free
                        </a>

                        <a
                            href="/image/png-to-jpg"
                            className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-600"
                        >
                            PNG to JPG
                        </a>

                        <a
                            href="/image/jpg-to-png"
                            className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-600"
                        >
                            JPG to PNG
                        </a>

                        <a
                            href="/image/webp-to-jpg"
                            className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-600"
                        >
                            WebP to JPG
                        </a>
                    </div>
                </div>
            </section>
        </ToolShell>
    );
}
