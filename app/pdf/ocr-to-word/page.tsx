export const dynamic = "force-dynamic";
export const revalidate = 0;

import ClientPage from "./ClientPage";

export const metadata = {
    title: "OCR PDF to Word Online",
    description:
        "Convert scanned PDFs to editable Word documents using OCR. Extract text from image-based PDFs online — no software download required.",
};

export default function Page() {
    return <ClientPage />;
}
