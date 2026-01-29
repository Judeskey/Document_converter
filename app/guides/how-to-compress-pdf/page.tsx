import GuideLayout from "@/components/guides/GuideLayout";
import EmbedPdfCompressTool from "@/components/seo/EmbedPdfCompressTool";

export const metadata = {
    title: "How to Compress a PDF (Reduce File Size) — DocConvertor",
    description:
        "Learn how to reduce PDF size for email or uploads. Compress PDFs online without installing software.",
};

export default function Page() {
    return (
        <GuideLayout
            title={metadata.title}
            description={metadata.description}
            h1="How to Compress a PDF"
            intro="Large PDFs can be hard to email or upload. The easiest solution is to compress your PDF online and download a smaller file."
            when={[
                "Your PDF is too large for email attachments",
                "A website has an upload size limit",
                "You want faster sharing and storage",
                "You’re preparing PDFs for submissions",
            ]}
            problems={[
                "Quality loss after compression",
                "Apps that force downloads/installations",
                "Confusing settings that break the PDF",
                "Tools that fail on big PDFs",
            ]}
            steps={[
                "Open the compress tool below",
                "Upload your PDF",
                "Compress the file",
                "Download the smaller PDF",
            ]}
            toolTitle="Compress PDF Tool"
            toolHref="/pdf/compress"
            embed={<EmbedPdfCompressTool />}
            faq={[
                { q: "Does compression reduce quality?", a: "Compression can reduce size while keeping good readability. Results vary by file." },
                { q: "Is it free?", a: "Yes. Free users have limited usage per tool; Pro is unlimited." },
                { q: "Do failed compressions burn usage?", a: "No. Usage counts only after a successful download." },
            ]}
        />
    );
}
