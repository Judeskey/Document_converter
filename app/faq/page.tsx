export const metadata = {
    title: "Frequently Asked Questions (FAQ)",
    description:
        "Frequently asked questions about DocConvertor — file privacy, free limits, Pro plans, billing, and supported tools.",
};

export default function FAQPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-white via-white to-neutral-50">
            {/* Hero */}
            <section className="border-b bg-gradient-to-r from-fuchsia-50 via-white to-cyan-50">
                <div className="mx-auto max-w-4xl px-4 py-10">
                    <div className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs text-neutral-700 shadow-sm">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        Help • FAQ
                    </div>

                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
                        Frequently Asked Questions
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">
                        Answers to common questions about DocConvertor, file privacy, free usage,
                        Pro plans, and billing.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2">
                        <Pill>Privacy</Pill>
                        <Pill>Free vs Pro</Pill>
                        <Pill>Billing</Pill>
                        <Pill>Security</Pill>
                        <Pill>Usage limits</Pill>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="mx-auto max-w-4xl px-4 py-10">
                <div className="rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
                    {/* General */}
                    <FAQSection title="General">
                        <FAQItem
                            q="What is DocConvertor?"
                            a="DocConvertor is an online platform that lets you convert, merge, split, compress, and OCR documents and images directly in your browser."
                        />
                        <FAQItem
                            q="Do I need to install software?"
                            a="No. DocConvertor works entirely online. You don’t need to install any apps or plugins."
                        />
                        <FAQItem
                            q="Which file types do you support?"
                            a="We support common document and image formats such as PDF, DOCX, JPG, PNG, WebP, and more. Supported formats may expand over time."
                        />
                    </FAQSection>

                    <Divider />

                    {/* Privacy & security */}
                    <FAQSection title="Privacy & Security">
                        <FAQItem
                            q="Are my files safe?"
                            a="Yes. Your files are used only to perform the requested operation. We do not sell or share your files for advertising."
                        />
                        <FAQItem
                            q="Do you store my uploaded files?"
                            a="Files are stored only as long as needed to complete processing and deliver your download. They are not kept permanently."
                        />
                        <FAQItem
                            q="Can I upload sensitive documents?"
                            a="While we take security seriously, we recommend avoiding highly sensitive documents unless necessary, as with any online service."
                        />
                    </FAQSection>

                    <Divider />

                    {/* Free vs Pro */}
                    <FAQSection title="Free vs Pro">
                        <FAQItem
                            q="Is DocConvertor free to use?"
                            a="Yes. Free users can use all tools with limited usage per tool."
                        />
                        <FAQItem
                            q="What does Pro give me?"
                            a="Pro unlocks unlimited access across all tools, removes free usage limits, and provides a smoother experience for frequent use."
                        />
                        <FAQItem
                            q="Will I be charged if a conversion fails?"
                            a="No. Usage is counted only after a successful download. Failed conversions do not consume your free usage or Pro benefits."
                        />
                    </FAQSection>

                    <Divider />

                    {/* Billing */}
                    <FAQSection title="Billing & Payments">
                        <FAQItem
                            q="How do payments work?"
                            a="Payments are processed securely by Stripe. DocConvertor does not store your full card details."
                        />
                        <FAQItem
                            q="Do you charge taxes?"
                            a="Taxes may apply depending on your location. For Canadian users, GST/HST is calculated automatically using Stripe Tax."
                        />
                        <FAQItem
                            q="Can I cancel my Pro subscription?"
                            a="Yes. You can cancel anytime through your account or Stripe’s customer portal. Your Pro access remains active until the end of the billing period."
                        />
                    </FAQSection>

                    <Divider />

                    {/* Accounts */}
                    <FAQSection title="Accounts & Login">
                        <FAQItem
                            q="Do I need an account to use DocConvertor?"
                            a="No account is required for basic free usage. An account is needed to manage Pro subscriptions and track usage."
                        />
                        <FAQItem
                            q="Can I sign in with Google or Facebook?"
                            a="Yes. We support third-party sign-in providers for convenience."
                        />
                    </FAQSection>

                    <Divider />

                    {/* Support */}
                    <FAQSection title="Support">
                        <FAQItem
                            q="How do I contact support?"
                            a="If you have questions or issues, email us at privacy@docconvertor.com and we’ll respond as soon as possible."
                        />
                        <FAQItem
                            q="Where can I find your policies?"
                            a="You can review our Privacy Policy and Terms of Service using the links in the footer."
                        />
                    </FAQSection>

                    {/* CTA */}
                    <div className="mt-10 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 text-center">
                        <h3 className="text-lg font-semibold text-neutral-900">
                            Still have questions?
                        </h3>
                        <p className="mt-2 text-sm text-neutral-600">
                            Explore the tools for free or upgrade to Pro for unlimited access.
                        </p>

                        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-center">
                            <a
                                href="/tools"
                                className="inline-flex items-center justify-center rounded-full border bg-white px-5 py-2 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
                            >
                                View tools →
                            </a>
                            <a
                                href="/pricing"
                                className="inline-flex items-center justify-center rounded-full bg-black px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
                            >
                                Go Pro
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

/* ---------- helpers ---------- */

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

function FAQSection({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section>
            <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
            <div className="mt-4 space-y-4">{children}</div>
        </section>
    );
}

function FAQItem({ q, a }: { q: string; a: string }) {
    return (
        <div className="rounded-2xl border border-neutral-200 bg-white p-4">
            <div className="text-sm font-semibold text-neutral-900">{q}</div>
            <div className="mt-1 text-sm leading-6 text-neutral-600">{a}</div>
        </div>
    );
}
