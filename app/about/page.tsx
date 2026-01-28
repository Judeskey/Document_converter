export const metadata = {
    title: "About DocConvertor",
    description:
        "Learn about DocConvertor — fast, secure online tools to convert, merge, split, compress, and OCR documents.",
};

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-white via-white to-neutral-50">
            {/* Hero */}
            <section className="border-b bg-gradient-to-r from-fuchsia-50 via-white to-cyan-50">
                <div className="mx-auto max-w-4xl px-4 py-10">
                    <div className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs text-neutral-700 shadow-sm">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        Company • About
                    </div>

                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
                        About DocConvertor
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">
                        DocConvertor provides simple, fast tools to convert, merge, split, compress,
                        and OCR documents online — built for students, professionals, and businesses.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2">
                        <Pill>Fast</Pill>
                        <Pill>Secure processing</Pill>
                        <Pill>Clean UX</Pill>
                        <Pill>Pro for power users</Pill>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="mx-auto max-w-4xl px-4 py-10">
                <div className="rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
                    {/* Mission */}
                    <Section
                        icon="🎯"
                        title="Our mission"
                        desc="Make document tasks easy for everyone — without complicated software."
                    >
                        <p className="mt-4 text-sm leading-6 text-neutral-700">
                            We built DocConvertor so you can handle everyday document tasks quickly:
                            merge PDFs, split pages, convert formats, compress files, or extract text with OCR —
                            all in a simple web experience.
                        </p>
                    </Section>

                    <Divider />

                    {/* What we offer */}
                    <Section
                        icon="🧰"
                        title="What we offer"
                        desc="A growing suite of tools designed around speed, reliability, and simplicity."
                    >
                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                            <FeatureCard title="Merge PDF" desc="Combine multiple PDFs into one file quickly." />
                            <FeatureCard title="Split PDF" desc="Split by pages or ranges with ease." />
                            <FeatureCard title="PDF to Word" desc="Convert to DOCX for editing (with OCR options)." />
                            <FeatureCard title="OCR PDF" desc="Extract text from scanned PDFs and images." />
                            <FeatureCard title="Compress PDF" desc="Reduce file size while keeping good quality." />
                            <FeatureCard title="Image Converter" desc="Convert PNG/JPG/WebP/AVIF formats fast." />
                        </div>
                    </Section>

                    <Divider />

                    {/* How it works */}
                    <Section
                        icon="⚙️"
                        title="How it works"
                        desc="A simple workflow from upload to download."
                    >
                        <ol className="mt-5 grid gap-3 sm:grid-cols-3">
                            <StepCard step="1" title="Upload" desc="Choose a file from your device." />
                            <StepCard step="2" title="Process" desc="We run the tool you selected." />
                            <StepCard step="3" title="Download" desc="Save the result instantly." />
                        </ol>

                        <div className="mt-5 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-700">
                            <div className="font-semibold text-neutral-900">Fair usage</div>
                            <p className="mt-1">
                                Free users have limited usage per tool. Pro users unlock unlimited access across all tools.
                            </p>
                        </div>
                    </Section>

                    <Divider />

                    {/* Security & privacy */}
                    <Section
                        icon="🛡️"
                        title="Security & privacy"
                        desc="We design the product to respect user privacy and keep processing safe."
                    >
                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                            <MiniCallout tone="info" title="Privacy-first">
                                We do not sell your uploaded files or share them for advertising.
                            </MiniCallout>
                            <MiniCallout tone="brand" title="Trusted billing">
                                Payments are processed by Stripe. We don’t store full card details.
                            </MiniCallout>
                        </div>

                        <p className="mt-4 text-sm leading-6 text-neutral-700">
                            For details, please read our{" "}
                            <a
                                href="/privacy"
                                className="font-medium text-neutral-900 underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-600"
                            >
                                Privacy Policy
                            </a>
                            .
                        </p>
                    </Section>

                    <Divider />

                    {/* CTA */}
                    <Section
                        icon="🚀"
                        title="Ready to get started?"
                        desc="Use the tools for free, and upgrade when you need unlimited power."
                    >
                        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                            <a
                                href="/tools"
                                className="inline-flex items-center justify-center rounded-full border bg-white px-5 py-2 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
                            >
                                View all tools →
                            </a>
                            <a
                                href="/pricing"
                                className="inline-flex items-center justify-center rounded-full bg-black px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
                            >
                                Go Pro
                            </a>
                        </div>

                        <p className="mt-6 text-xs text-neutral-500">
                            Last updated: January 27, 2026
                        </p>
                    </Section>
                </div>
            </section>
        </main>
    );
}

/* ---------- UI helpers ---------- */

function Divider() {
    return <div className="my-8 border-t border-neutral-200/70" />;
}

function Pill({ children }: { children: React.ReactNode }) {
    return (
        <span className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-700 shadow-sm">
            {children}
        </span>
    );
}

function Section({
    icon,
    title,
    desc,
    children,
}: {
    icon: string;
    title: string;
    desc: string;
    children: React.ReactNode;
}) {
    return (
        <section>
            <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl border bg-white text-base shadow-sm">
                    {icon}
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
                    <p className="mt-1 text-sm text-neutral-600">{desc}</p>
                </div>
            </div>
            {children}
        </section>
    );
}

function FeatureCard({ title, desc }: { title: string; desc: string }) {
    return (
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3">
            <div className="text-sm font-semibold text-neutral-900">{title}</div>
            <div className="mt-1 text-sm text-neutral-600">{desc}</div>
        </div>
    );
}

function StepCard({ step, title, desc }: { step: string; title: string; desc: string }) {
    return (
        <li className="rounded-2xl border border-neutral-200 bg-white px-4 py-4 shadow-sm">
            <div className="text-xs font-semibold text-neutral-500">Step {step}</div>
            <div className="mt-1 text-sm font-semibold text-neutral-900">{title}</div>
            <div className="mt-1 text-sm text-neutral-600">{desc}</div>
        </li>
    );
}

function MiniCallout({
    tone,
    title,
    children,
}: {
    tone: "info" | "brand";
    title: string;
    children: React.ReactNode;
}) {
    const styles =
        tone === "brand" ? "border-fuchsia-200 bg-fuchsia-50" : "border-cyan-200 bg-cyan-50";

    return (
        <div className={`rounded-2xl border p-4 ${styles}`}>
            <div className="text-sm font-semibold text-neutral-900">{title}</div>
            <div className="mt-2 text-sm text-neutral-700">{children}</div>
        </div>
    );
}
