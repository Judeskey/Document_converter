import GuideLayout from "@/components/guides/GuideLayout";
import EmbedImageConvertTool from "@/components/seo/EmbedImageConvertTool";

export const metadata = {
    title: "How to Convert Images Online (PNG, JPG, WebP) — DocConvertor",
    description:
        "Learn how to convert images between PNG, JPG, WebP, AVIF quickly online. No installation required.",
};

export default function Page() {
    return (
        <GuideLayout
            title={metadata.title}
            description={metadata.description}
            h1="How to Convert Images Online"
            intro="If you need to convert PNG to JPG, JPG to PNG, or WebP to JPG, the safest method is doing it directly in your browser — without installing software."
            when={[
                "You need a JPG for smaller file size",
                "You need a PNG for transparency",
                "A website requires WebP/AVIF formats",
                "You’re converting images for email or WhatsApp",
            ]}
            problems={[
                "Apps that force installation",
                "Loss of quality after conversion",
                "Confusing export settings",
                "Files not compatible with websites",
            ]}
            steps={[
                "Open the tool below",
                "Upload your image (PNG/JPG/WebP/AVIF)",
                "Choose the output format",
                "Convert and download instantly",
            ]}
            toolTitle="Image Converter Tool"
            toolHref="/image/convert"
            embed={<EmbedImageConvertTool />}
            faq={[
                { q: "Is the image converter free?", a: "Yes. Free users have limited usage per tool. Pro users get unlimited access across all tools." },
                { q: "Do you keep my images?", a: "No. Files are processed only to complete your request and deliver your download." },
                { q: "Does it work on mobile?", a: "Yes. It works on modern browsers on iPhone and Android." },
            ]}
        />
    );
}
