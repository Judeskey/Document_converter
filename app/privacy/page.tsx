export const metadata = {
    title: "Privacy Policy",
    description:
        "DocConvertor privacy policy explaining how we handle files, account data, analytics, cookies, payments, and data deletion requests.",
};

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-white via-white to-neutral-50">
            {/* Hero */}
            <section className="border-b bg-gradient-to-r from-fuchsia-50 via-white to-cyan-50">
                <div className="mx-auto max-w-4xl px-4 py-10">
                    <div className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs text-neutral-700 shadow-sm">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        Legal • Privacy
                    </div>

                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
                        Privacy Policy
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">
                        DocConvertor (“we”, “our”, “us”) respects your privacy and is committed
                        to protecting your personal data. This policy explains what we collect,
                        why we collect it, and how we handle your information when you use
                        docconvertor.com.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2">
                        <Pill>Files</Pill>
                        <Pill>Accounts</Pill>
                        <Pill>Analytics</Pill>
                        <Pill>Payments</Pill>
                        <Pill>Deletion Requests</Pill>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="mx-auto max-w-4xl px-4 py-10">
                <div className="rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
                    <Section
                        icon="📦"
                        title="1) What we collect"
                        desc="We collect only what we need to operate the service and keep it secure."
                    >
                        <ul className="mt-4 space-y-3 text-sm text-neutral-700">
                            <li>
                                <strong>Account information (if you sign in):</strong> your email
                                address, name (if provided by the sign-in provider), and a user ID
                                in our system.
                            </li>
                            <li>
                                <strong>Uploaded files:</strong> documents and images you upload to
                                use our tools (e.g., merge, split, convert, OCR, compress).
                            </li>
                            <li>
                                <strong>Usage and diagnostics:</strong> basic information such as
                                tool usage events, error logs, and performance metrics to keep the
                                service reliable and prevent abuse.
                            </li>
                            <li>
                                <strong>Billing information (Pro users):</strong> subscription
                                status, Stripe Customer ID, and plan type. We do not store full card
                                details on DocConvertor.
                            </li>
                            <li>
                                <strong>Cookies / local storage:</strong> used for authentication,
                                session continuity, and basic site behavior.
                            </li>
                        </ul>
                    </Section>

                    <Divider />

                    <Section
                        icon="🎯"
                        title="2) How we use your information"
                        desc="We use your information to deliver conversions and keep the platform safe."
                    >
                        <ul className="mt-4 grid gap-3 text-sm text-neutral-700 sm:grid-cols-2">
                            <Bullet>To provide and operate our tools and features.</Bullet>
                            <Bullet>To process conversions you request (e.g., PDF to Word, OCR).</Bullet>
                            <Bullet>To track usage limits for free users and enable Pro access.</Bullet>
                            <Bullet>To improve performance, reliability, and security.</Bullet>
                            <Bullet>To prevent fraud, abuse, and unauthorized access.</Bullet>
                        </ul>
                    </Section>

                    <Divider />

                    <Section
                        icon="🛡️"
                        title="3) Uploaded files and file handling"
                        desc="Your files are used only to perform the conversion you request."
                    >
                        <p className="mt-4 text-sm leading-6 text-neutral-700">
                            Uploaded files are used only to perform the requested conversion. We
                            do not sell your files or share them for advertising.
                        </p>

                        <Callout tone="warning" title="Important">
                            As with many online conversion services, files may be processed
                            temporarily on our servers to complete your request. We recommend you
                            avoid uploading highly sensitive documents unless necessary.
                        </Callout>
                    </Section>

                    <Divider />

                    <Section
                        icon="🗂️"
                        title="4) Data retention"
                        desc="We keep data only as long as needed to provide the service and protect against abuse."
                    >
                        <ul className="mt-4 space-y-3 text-sm text-neutral-700">
                            <li>
                                <strong>Files:</strong> stored only as long as necessary to complete
                                processing and deliver your download.
                            </li>
                            <li>
                                <strong>Account data:</strong> retained while your account remains
                                active or as needed for legitimate business purposes.
                            </li>
                            <li>
                                <strong>Billing status:</strong> retained to manage your subscription
                                and access level.
                            </li>
                        </ul>
                    </Section>

                    <Divider />

                    <Section
                        icon="📈"
                        title="5) Analytics"
                        desc="We use analytics to improve the product—not to sell personal information."
                    >
                        <p className="mt-4 text-sm leading-6 text-neutral-700">
                            We may use analytics to understand traffic and improve user experience
                            (for example: page views, tool usage, and conversions). Analytics data
                            is used to improve the product, not to sell personal information.
                        </p>
                    </Section>

                    <Divider />

                    <Section
                        icon="🍪"
                        title="6) Cookies"
                        desc="Cookies help us keep you signed in and protect the service."
                    >
                        <p className="mt-4 text-sm leading-6 text-neutral-700">
                            Cookies and similar technologies help us keep you signed in, protect
                            the site, and measure basic usage. You can control cookies through your
                            browser settings, but some features may not work properly if cookies
                            are disabled.
                        </p>
                    </Section>

                    <Divider />

                    <Section
                        icon="🤝"
                        title="7) Third-party services"
                        desc="We may use trusted providers for sign-in, payments, and infrastructure."
                    >
                        <ul className="mt-4 space-y-3 text-sm text-neutral-700">
                            <li>
                                <strong>Authentication providers</strong> (e.g., Google, Facebook)
                                to allow you to sign in.
                            </li>
                            <li>
                                <strong>Payments</strong> (Stripe) to manage Pro subscriptions,
                                billing, and tax calculations.
                            </li>
                            <li>
                                <strong>Infrastructure</strong> (hosting, storage, logging) to run
                                the service reliably.
                            </li>
                        </ul>

                        <Callout tone="info" title="Note">
                            These providers may process data on our behalf only to provide their
                            services. Their handling of your data is governed by their own privacy
                            policies.
                        </Callout>
                    </Section>

                    <Divider />

                    <Section
                        icon="💳"
                        title="8) Payments (Stripe)"
                        desc="Stripe processes payments. We store only minimal billing metadata."
                    >
                        <p className="mt-4 text-sm leading-6 text-neutral-700">
                            Payments for Pro subscriptions are processed by Stripe. DocConvertor does
                            not store your full payment card information. We store limited billing
                            metadata (such as your Stripe Customer ID and subscription status) so we
                            can manage your Pro access.
                        </p>
                    </Section>

                    <Divider />

                    <Section
                        icon="🔒"
                        title="9) Security"
                        desc="We take reasonable measures to protect your data."
                    >
                        <p className="mt-4 text-sm leading-6 text-neutral-700">
                            We take reasonable steps to protect your information using appropriate
                            technical and organizational measures. However, no online service can be
                            guaranteed 100% secure.
                        </p>
                    </Section>

                    <Divider />

                    <Section
                        icon="🧾"
                        title="10) Your rights and choices"
                        desc="You may request access, correction, or deletion of your data."
                    >
                        <p className="mt-4 text-sm leading-6 text-neutral-700">
                            You can request access, correction, or deletion of your personal data,
                            subject to legal requirements. To make a request, contact us at the email
                            below.
                        </p>
                    </Section>

                    <Divider />

                    <Section
                        icon="🗑️"
                        title="11) Facebook data deletion request"
                        desc="If you signed in with Facebook Login, you can request deletion of associated data."
                    >
                        <Callout tone="brand" title="How to request deletion">
                            <p className="text-sm text-neutral-700">
                                Email <strong>privacy@docconvertor.com</strong> with the subject line:
                                <br />
                                <em>“Facebook Data Deletion Request”</em>
                            </p>
                            <p className="mt-2 text-sm text-neutral-700">
                                Please include your Facebook User ID or the email address used to sign
                                in. All associated user data will be permanently deleted within 30
                                days.
                            </p>
                        </Callout>
                    </Section>

                    <Divider />

                    <Section
                        icon="👶"
                        title="12) Children’s privacy"
                        desc="DocConvertor is not intended for children under 13."
                    >
                        <p className="mt-4 text-sm leading-6 text-neutral-700">
                            DocConvertor is not intended for children under 13. If you believe a
                            child has provided personal information, contact us so we can delete it.
                        </p>
                    </Section>

                    <Divider />

                    <Section
                        icon="📩"
                        title="13) Contact"
                        desc="Questions? Reach out anytime."
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

function Bullet({ children }: { children: React.ReactNode }) {
    return (
        <li className="flex items-start gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2">
            <span className="mt-0.5 text-neutral-400">•</span>
            <span>{children}</span>
        </li>
    );
}

function Callout({
    tone,
    title,
    children,
}: {
    tone: "info" | "warning" | "brand";
    title: string;
    children: React.ReactNode;
}) {
    const styles =
        tone === "warning"
            ? "border-amber-200 bg-amber-50"
            : tone === "brand"
                ? "border-fuchsia-200 bg-fuchsia-50"
                : "border-cyan-200 bg-cyan-50";

    return (
        <div className={`mt-5 rounded-2xl border p-4 ${styles}`}>
            <div className="text-sm font-semibold text-neutral-900">{title}</div>
            <div className="mt-2">{children}</div>
        </div>
    );
}
