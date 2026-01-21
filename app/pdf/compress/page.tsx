import ToolShell from "@/components/ToolShell";
import ToolPageHeader from "@/components/ToolPageHeader";
import ClientOnly from "./ClientOnly";

// ✅ Prevent static prerender (keeps it from trying to prerender at build time)
export const dynamic = "force-dynamic";

export default function Page() {
    return (
        <ToolShell>
            <ToolPageHeader
                title="PDF Compress"
                description="Reduce PDF size with lossless or strong compression."
            />
            <ClientOnly />
        </ToolShell>
    );
}
