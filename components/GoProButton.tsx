"use client";

import { useEffect, useState } from "react";
import { isProUser } from "@/lib/isPro";

type MeResp =
    | { ok: true; user: any }
    | { ok: false; error: string };

export default function GoProButton() {
    const [loading, setLoading] = useState(true);
    const [isPro, setIsPro] = useState(false);

    useEffect(() => {
        let alive = true;

        (async () => {
            try {
                const res = await fetch("/api/billing/me", { cache: "no-store" });
                const data = (await res.json()) as MeResp;

                if (!alive) return;

                if (res.ok && data.ok) setIsPro(isProUser(data.user));
                else setIsPro(false);
            } catch {
                if (alive) setIsPro(false);
            } finally {
                if (alive) setLoading(false);
            }
        })();

        return () => {
            alive = false;
        };
    }, []);

    if (loading) {
        return (
            <button className="rounded-full bg-black px-4 py-2 text-white opacity-80">
                Loading...
            </button>
        );
    }

    if (isPro) {
        return (
            <button className="rounded-full bg-black px-4 py-2 text-white opacity-80">
                Pro Active
            </button>
        );
    }

    return (
        <a
            href="/pricing"
            className="rounded-full bg-black px-4 py-2 text-white"
        >
            Go Pro
        </a>
    );
}
