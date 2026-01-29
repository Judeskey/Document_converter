import GuideLayout from "@/components/guides/GuideLayout";
import EmbedPdfSplitTool from "@/components/seo/EmbedPdfSplitTool";

export const metadata = {
    title: "How to Split a PDF (By Page or Range) — DocConvertor",
    description:
        "Learn how to split a PDF into separate pages or extract a range online. Fast, secure, no installation required.",
};

export default function Page() {
    return (
        <GuideLayout
            title={metadata.title}
            description={metadata.description}
            h1="How to Split a PDF"
            intro="Splitting a PDF is useful when you need only certain pages, or when a file is too large. You can split by page or by range right in your browser."
            when={[
                "You need to extract a few pages from a PDF",
                "You want separate PDFs for each page",
                "You’re submitting only part of a document",
                "You need to remove extra pages",
            ]}
            problems={[
                "Tools that are confusing to use",
                "Software downloads and installers",
                "Output files that aren’t named clearly",
                "Limits on how often you can split",
            ]}
            steps={[
                "Open the split tool below",
                "Upload your PDF",
                "Choose split by pages or range",
                "Download your split PDFs",
            ]}
            toolTitle="PDF Split Tool"
            toolHref="/pdf/split"
            embed={<EmbedPdfSplitTool />}
            faq={[
                { q: "Can I split a PDF for free?", a: "Yes. Free users have limited usage per tool; Pro is unlimited." },
                { q: "Does splitting change quality?", a: "No. Splitting keeps the original PDF pages as-is." },
                { q: "Do failed splits burn usage?", a: "No. Usage counts only after a successful download." },
            ]}
        />
    );
}
