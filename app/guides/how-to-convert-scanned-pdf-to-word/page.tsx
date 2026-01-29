import GuideLayout from "@/components/guides/GuideLayout";
import EmbedPdfOcrToWordTool from "@/components/seo/EmbedPdfOcrToWordTool";

export const metadata = {
    title: "How to Convert Scanned PDF to Word (OCR) — DocConvertor",
    description:
        "Learn how to extract text from scanned PDFs using OCR and convert to Word. Fast, secure, online.",
};

export default function Page() {
    return (
        <GuideLayout
            title={metadata.title}
            description={metadata.description}
            h1="How to Convert a Scanned PDF to Word (OCR)"
            intro="Scanned PDFs are images, so regular converters can’t edit the text. OCR (Optical Character Recognition) extracts text and converts it into an editable Word document."
            when={[
                "Your PDF is scanned (text can’t be selected)",
                "You need editable text from a scanned document",
                "You’re working with scanned receipts or forms",
                "You want searchable text for archiving",
            ]}
            problems={[
                "Text can’t be selected in scanned PDFs",
                "OCR accuracy varies depending on scan quality",
                "Some tools require software downloads",
                "Failed OCR shouldn’t waste usage",
            ]}
            steps={[
                "Open the OCR PDF to Word tool below",
                "Upload your scanned PDF",
                "Run OCR to extract text",
                "Download your editable Word document",
            ]}
            toolTitle="OCR PDF to Word Tool"
            toolHref="/pdf/ocr-to-word"
            embed={<EmbedPdfOcrToWordTool />}
            faq={[
                { q: "How do I know if my PDF needs OCR?", a: "If you can’t highlight/select text in the PDF, it likely needs OCR." },
                { q: "Is OCR free?", a: "Free users have limited usage; Pro users get unlimited access." },
                { q: "Do failed OCR attempts burn usage?", a: "No. Usage counts only after a successful download." },
            ]}
        />
    );
}
