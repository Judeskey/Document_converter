import GuideLayout from "@/components/guides/GuideLayout";
import EmbedPdfToImageTool from "@/components/seo/EmbedPdfToImageTool";

export const metadata = {
    title: "How to Convert PDF to Images (JPG/PNG) — DocConvertor",
    description:
        "Learn how to convert PDF pages into JPG or PNG images online. Fast, secure, and high-quality conversion.",
};

export default function Page() {
    return (
        <GuideLayout
            title={metadata.title}
            description={metadata.description}
            h1="How to Convert PDF to Images"
            intro="Converting a PDF into images is useful for presentations, previews, or sharing single pages. You can convert pages to JPG or PNG in your browser."
            when={[
                "You need a PDF page as an image for slides",
                "You want to share a single page in chat",
                "You need JPG for smaller size or PNG for clarity",
                "You want to extract visuals quickly",
            ]}
            problems={[
                "Low-quality exports",
                "Tools that require installation",
                "Pages exporting in the wrong order",
                "Conversion failures on large PDFs",
            ]}
            steps={[
                "Open the PDF to image tool below",
                "Upload your PDF",
                "Choose JPG or PNG output",
                "Convert and download your images",
            ]}
            toolTitle="PDF to Image Tool"
            toolHref="/pdf/to-image"
            embed={<EmbedPdfToImageTool />}
            faq={[
                { q: "Is PDF to image free?", a: "Yes. Free users have limited usage per tool; Pro is unlimited." },
                { q: "Do you keep the PDF?", a: "No. Files are processed only to complete conversion and deliver download." },
                { q: "Can I convert many pages?", a: "Yes, but limits may apply on Free. Pro is best for heavy usage." },
            ]}
        />
    );
}
