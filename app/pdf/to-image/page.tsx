export const dynamic = "force-dynamic";
export const revalidate = 0;

import ClientPage from "./ClientPage";

export const metadata = {
    title: "Convert PDF to Images Online",
    description:
        "Convert PDF pages to JPG or PNG online. Fast, secure, and high-quality conversion.",
};

export default function Page() {
    return (
        <>
            {/* Main tool UI */}
            <ClientPage />

            {/* SEO: Internal links to programmatic pages */}
            <section className="mx-auto mt-12 max-w-5xl px-4">
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                    <h2 className="text-sm font-semibold text-neutral-900">
                        Popular searches
                    </h2>

                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                        <a
                            href="/pdf-to-image/pdf-to-image-online"
                            className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-600"
                        >
                            PDF to Image Online
                        </a>

                        <a
                            href="/pdf-to-image/pdf-to-jpg"
                            className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-600"
                        >
                            PDF to JPG
                        </a>

                        <a
                            href="/pdf-to-image/pdf-to-png"
                            className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-600"
                        >
                            PDF to PNG
                        </a>

                        <a
                            href="/pdf-to-image/convert-pdf-to-images"
                            className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-600"
                        >
                            Convert PDF to Images
                        </a>

                        <a
                            href="/pdf-to-image/extract-images-from-pdf"
                            className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-600"
                        >
                            Extract Images from PDF
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
}
