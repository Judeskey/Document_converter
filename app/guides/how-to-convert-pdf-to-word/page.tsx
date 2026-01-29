import GuideLayout from "@/components/guides/GuideLayout";
import EmbedPdfToWordTool from "@/components/seo/EmbedPdfToWordTool";

export const metadata = {
    title: "How to Convert PDF to Word (DOCX) — DocConvertor",
    description:
        "Learn how to turn a PDF into an editable Word document. Works online, secure, no installation required.",
};

export default function Page() {
    return (
        <GuideLayout
            title={metadata.title}
            description={metadata.description}
            h1="How to Convert PDF to Word"
            intro="If you need to edit a PDF, converting it to Word (DOCX) is often the fastest approach. You can do it securely online in your browser."
            when={[
                "You need to edit text in a PDF",
                "You want to reuse content in Word",
                "You’re updating reports, resumes, or forms",
                "You want a DOCX file for collaboration",
            ]}
            problems={[
                "Formatting issues after conversion",
                "Tools that require software installation",
                "Conversion failures on large PDFs",
                "Scanned PDFs need OCR to extract text",
            ]}
            steps={[
                "Open the PDF to Word tool below",
                "Upload your PDF",
                "Convert to DOCX",
                "Download your Word document",
            ]}
            toolTitle="PDF to Word Tool"
            toolHref="/pdf/to-word"
            embed={<EmbedPdfToWordTool />}
            faq={[
                { q: "Is PDF to Word free?", a: "Yes. Free users have limited usage per tool; Pro is unlimited." },
                { q: "What about scanned PDFs?", a: "Scanned PDFs usually need OCR. Use the OCR PDF to Word tool for best results." },
                { q: "Do failed conversions burn usage?", a: "No. Usage counts only after a successful download." },
            ]}
        />
    );
}
