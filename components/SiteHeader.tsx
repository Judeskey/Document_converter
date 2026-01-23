"use client";

import Link from "next/link";
import Image from "next/image";

type Props = {
    rightSlot?: React.ReactNode; // we will pass your existing auth/buttons here
};

export default function SiteHeader({ rightSlot }: Props) {
    return (
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
                {/* Left: Brand */}
                <div className="flex items-center gap-3">
                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src="/logo.png"
                            alt="DocConvert"
                            width={28}
                            height={28}
                            priority
                        />
                        <span className="text-base font-semibold tracking-tight">
                            DocConvert
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <nav className="hidden items-center gap-6 pl-6 text-sm text-neutral-700 md:flex">
                        <Link href="/#tools" className="hover:text-neutral-900">
                            Tools
                        </Link>
                        <Link href="/pricing" className="hover:text-neutral-900">
                            Pricing
                        </Link>
                        <Link href="/#faq" className="hover:text-neutral-900">
                            FAQ
                        </Link>
                    </nav>
                </div>

                {/* Right: Buttons/Auth */}
                <div className="flex items-center gap-2">
                    {rightSlot ?? (
                        <>
                            <Link
                                href="/tools"
                                className="hidden rounded-full border px-4 py-2 text-sm font-medium hover:bg-neutral-50 md:inline-flex"
                            >
                                View all tools →
                            </Link>

                            <Link
                                href="/signin"
                                className="rounded-full border px-4 py-2 text-sm font-medium hover:bg-neutral-50"
                            >
                                Sign in
                            </Link>

                            <Link
                                href="/pricing"
                                className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
                            >
                                Go Pro
                            </Link>
                        </>
                    )}
                </div>

            </div>
        </header>
    );
}
