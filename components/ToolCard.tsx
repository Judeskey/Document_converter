"use client";

import Link from "next/link";
import React from "react";

type Props = {
    title: string;
    subtitle?: string;
    badge?: string;
    gradient?: string; // e.g. "from-fuchsia-500 to-pink-500"
    icon?: string; // emoji
    children: React.ReactNode;
};

export default function ToolCard({
    title,
    subtitle,
    badge,
    gradient = "from-gray-900 to-gray-700",
    icon = "🛠️",
    children,
}: Props) {
    return (
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
            {/* Top nav */}
            <div className="flex items-center justify-between gap-3">
                <Link
                    href="/tools"
                    className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold hover:bg-gray-50"
                >
                    ← All tools
                </Link>

                <Link
                    href="/"
                    className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black"
                >
                    Home
                </Link>
            </div>

            {/* Header */}
            <div className="mt-6 rounded-3xl border bg-gradient-to-br from-gray-50 to-white p-6 sm:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                        <div className="flex items-center gap-3">
                            <div
                                className={[
                                    "flex h-12 w-12 items-center justify-center rounded-2xl text-xl text-white shadow-sm",
                                    "bg-gradient-to-br",
                                    gradient,
                                ].join(" ")}
                            >
                                {icon}
                            </div>

                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="truncate text-2xl font-extrabold tracking-tight text-gray-900">
                                        {title}
                                    </h1>
                                    {badge ? (
                                        <span className="rounded-full border bg-white px-2 py-0.5 text-xs font-semibold text-gray-700">
                                            {badge}
                                        </span>
                                    ) : null}
                                </div>

                                {subtitle ? (
                                    <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
                                ) : null}
                            </div>
                        </div>
                    </div>

                    <Link
                        href="/tools"
                        className="hidden sm:inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold hover:bg-gray-50"
                    >
                        Browse tools →
                    </Link>
                </div>

                <div className="mt-6">{children}</div>
            </div>
        </div>
    );
}
