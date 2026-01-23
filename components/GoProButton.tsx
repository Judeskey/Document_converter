"use client";

export default function GoProButton() {
    async function goPro() {
        const res = await fetch("/api/billing/checkout", { method: "POST" });
        const data = await res.json();

        if (!res.ok) {
            alert(data?.error || "Unable to start checkout");
            return;
        }

        window.location.href = data.url;
    }

    return (
        <button
            onClick={goPro}
            className="rounded-md bg-black px-4 py-2 text-white hover:opacity-90"
        >
            Go Pro
        </button>
    );
}
