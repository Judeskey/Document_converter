import GuideLayout from "@/components/guides/GuideLayout";
import EmbedPdfMergeTool from "@/components/seo/EmbedPdfMergeTool";

export const metadata = {
    title: "How to Merge PDF Files (Fast & Secure) — DocConvertor",
    description:
        "Learn how to combine multiple PDFs into one file online. Reorder pages, merge, and download instantly.",
};

export default function Page() {
    return (
        <GuideLayout
            title={metadata.title}
            description={metadata.description}
            h1="How to Merge PDF Files"
            intro="Merging PDFs helps you combine documents into a single file for sharing, printing, or storage. The easiest option is a browser-based merge tool."
            when={[
                "You need to combine invoices into one PDF",
                "You want to submit multiple documents as one file",
                "You’re merging scanned pages into one report",
                "You want a single PDF for email submission",
            ]}
            problems={[
                "Software downloads that feel risky",
                "Tools that don’t allow reordering",
                "Merged output that fails to open",
                "Limits that block frequent usage",
            ]}
            steps={[
                "Open the merge tool below",
                "Upload your PDFs",
                "Reorder the files/pages if needed",
                "Merge and download the final PDF",
            ]}
            toolTitle="PDF Merge Tool"
            toolHref="/pdf/merge"
            embed={<EmbedPdfMergeTool />}
            faq={[
                { q: "Is PDF merge free?", a: "Yes. Free users get limited usage per tool. Pro users get unlimited access." },
                { q: "Will a failed merge burn usage?", a: "No. Usage counts only after a successful download." },
                { q: "Do you keep my PDFs?", a: "No. Files are processed only to complete your request and deliver the result." },
            ]}
        />
    );
}
