export const metadata = {
    title: "Terms of Service",
    description:
        "DocConvertor Terms of Service covering acceptable use, subscriptions, disclaimers, and liability limitations.",
};

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-white via-white to-neutral-50">
            {/* Hero */}
            <section className="border-b bg-gradient-to-r from-fuchsia-50 via-white to-cyan-50">
                <div className="mx-auto max-w-4xl px-4 py-10">
                    <div className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs text-neutral-700 shadow-sm">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        Legal • Terms
                    </div>

                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
                        Terms of Service
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">
                        By accessing or using DocConvertor, you agree to these Terms. Please read
                        them carefully. If you do not agree, do not use the service.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2">
                        <Pill>Acceptable Use</Pill>
                        <Pill>Subscriptions</Pill>
                        <Pill>Disclaimers</Pill>
                        <Pill>Liability</Pill>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="mx-auto max-w-4xl px-4 py-10">
                <div className="rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
                    <Section
                        icon="✅"
                        title="1) Acceptance of Terms"
                        desc="Using the service means you agree to these Terms."
                    >
                        <p className="mt-4 text-sm leading-6 text-neutral-700">
                            These Terms govern your access to and use of DocConvertor (the “Service”).
                            We may update these Terms from time to time. Continued use of the Service
                            after changes means you accept the updated Terms.
                        </p>
                    </Section>

                    <Divider />

                    <Section
                        icon="🧰"
                        title="2) The Service"
                        desc="DocConvertor provides online document and image tools."
                    >
                        <p className="mt-4 text-sm leading-6 text-neutral-700">
                            DocConvertor offers tools such as converting file formats, merging and
                            splitting PDFs, compressing PDFs, and OCR. We may add, remove, or modify
                            features to improve the Service.
                        </p>
                    </Section>

                    <Divider />

                    <Section
                        icon="🙅‍♂️"
                        title="3) Acceptable Use"
                        desc="Use the Service responsibly and lawfully."
                    >
                        <ul className="mt-4 space-y-3 text-sm text-neutral-700">
                            <li>
                                You agree not to upload or process content that is illegal, harmful,
                                infringing, or that you do not have the right to use.
                            </li>
                            <li>
                                You agree not to attempt to disrupt, attack, reverse engineer, scrape,
                                or abuse the Service or its infrastructure.
                            </li>
                            <li>
                                You agree not to use the Service for malware, phishing, spam, or to
                                violate privacy or security of others.
                            </li>
                        </ul>

                        <Callout tone="warning" title="Important">
                            You are responsible for the files you upload and the rights you have to
                            process them.
                        </Callout>
                    </Section>

                    <Divider />

                    <Section
                        icon="👤"
                        title="4) Accounts"
                        desc="You may need an account to access certain features."
                    >
                        <p className="mt-4 text-sm leading-6 text-neutral-700">
                            If you create an account or sign in using a provider (e.g., Google or
                            Facebook), you are responsible for maintaining the confidentiality of
                            your account and for activities under your account.
                        </p>
                    </Section>

                    <Divider />

                    <Section
                        icon="💳"
                        title="5) Subscriptions and Billing (Pro)"
                        desc="Pro provides unlimited access across tools."
                    >
                        <ul className="mt-4 space-y-3 text-sm text-neutral-700">
                            <li>
                                Pro subscriptions are billed through our payment processor (Stripe).
                            </li>
                            <li>
                                Subscription access and plan status are activated and managed based on
                                billing confirmation.
                            </li>
                            <li>
                                Taxes may apply depending on your location and Stripe Tax settings.
                            </li>
                        </ul>

                        <Callout tone="info" title="Note">
                            Payment details are processed by Stripe. DocConvertor does not store full
                            card information.
                        </Callout>
                    </Section>

                    <Divider />

                    <Section
                        icon="📉"
                        title="6) Fair Usage (Free Plan)"
                        desc="Free users have limited usage; Pro users have unlimited access."
                    >
                        <p className="mt-4 text-sm leading-6 text-neutral-700">
                            Free users may have per-tool limits. Pro users have unlimited usage
                            across tools while their subscription is active.
                        </p>
                    </Section>

                    <Divider />

                    <Section
                        icon="🔒"
                        title="7) Privacy"
                        desc="We care about how your data is handled."
                    >
                        <p className="mt-4 text-sm leading-6 text-neutral-700">
                            Our Privacy Policy explains how we collect and use information, including
                            file handling and deletion requests.
                        </p>

                        <div className="mt-5 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-700">
                            <div className="font-semibold text-neutral-900">Read our Privacy Policy</div>
                            <a
                                href="/privacy"
                                className="mt-1 inline-block font-medium text-neutral-900 underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-600"
                            >
                                /privacy →
                            </a>
                        </div>
                    </Section>

                    <Divider />

                    <Section
                        icon="⚠️"
                        title="8) Disclaimer (No Warranty)"
                        desc="The service is provided “as is”."
                    >
                        <p className="mt-4 text-sm leading-6 text-neutral-700">
                            The Service is provided on an “as is” and “as available” basis without
                            warranties of any kind, whether express or implied. We do not guarantee
                            that the Service will be uninterrupted, error-free, or free of harmful
                            components.
                        </p>
                    </Section>

                    <Divider />

                    <Section
                        icon="🧯"
                        title="9) Limitation of Liability"
                        desc="We limit liability to the maximum extent permitted by law."
                    >
                        <p className="mt-4 text-sm leading-6 text-neutral-700">
                            To the maximum extent permitted by applicable law, DocConvertor will not
                            be liable for indirect, incidental, special, consequential, or punitive
                            damages, or any loss of data, profits, revenue, or business arising from
                            your use of the Service.
                        </p>
                    </Section>

                    <Divider />

                    <Section
                        icon="🛑"
                        title="10) Termination"
                        desc="We may suspend or terminate access if the Terms are violated."
                    >
                        <p className="mt-4 text-sm leading-6 text-neutral-700">
                            We may suspend or terminate your access to the Service at any time if we
                            reasonably believe you have violated these Terms or used the Service in
                            a harmful or unlawful way.
                        </p>
                    </Section>

                    <Divider />

                    <Section
                        icon="🌍"
                        title="11) Governing Law"
                        desc="These Terms are governed by applicable laws in your jurisdiction."
                    >
                        <p className="mt-4 text-sm leading-6 text-neutral-700">
                            These Terms are governed by the laws applicable to the operation of the
                            Service. If required, disputes will be resolved in accordance with
                            applicable law.
                        </p>
                    </Section>

                    <Divider />

                    <Section
                        icon="📩"
                        title="12) Contact"
                        desc="Questions about these Terms? Contact us."
                    >
                        <div className="mt-4 rounded-xl border bg-neutral-50 p-4 text-sm text-neutral-700">
                            <div className="font-medium text-neutral-900">Email</div>
                            <div className="mt-1">
                                <a
                                    href="mailto:privacy@docconvertor.com"
                                    className="text-neutral-900 underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-600"
                                >
                                    privacy@docconvertor.com
                                </a>
                            </div>
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

/* ---------- small UI helpers ---------- */

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

function Callout({
    tone,
    title,
    children,
}: {
    tone: "info" | "warning";
    title: string;
    children: React.ReactNode;
}) {
    const styles =
        tone === "warning"
            ? "border-amber-200 bg-amber-50"
            : "border-cyan-200 bg-cyan-50";

    return (
        <div className={`mt-5 rounded-2xl border p-4 ${styles}`}>
            <div className="text-sm font-semibold text-neutral-900">{title}</div>
            <div className="mt-2 text-sm text-neutral-700">{children}</div>
        </div>
    );
}
