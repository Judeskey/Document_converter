import Link from "next/link";

type FAQ = { q: string; a: string };

type Props = {
    title: string;
    description: string;
    h1: string;
    intro: string;
    when: string[];
    problems: string[];
    steps: string[];
    toolTitle: string;
    toolHref: string;
    embed: React.ReactNode;
    faq: FAQ[];
};

export default function GuideLayout(props: Props) {
    return (
        <main className="min-h-screen bg-gradient-to-b from-white via-white to-neutral-50">
            <section className="border-b bg-gradient-to-r from-fuchsia-50 via-white to-cyan-50">
                <div className="mx-auto max-w-5xl px-4 py-10">
                    <div className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs text-neutral-700 shadow-sm">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        Guide • DocConvertor
                    </div>

                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
                        {props.h1}
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">
                        {props.intro}
                    </p>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <Link
                            href={props.toolHref}
                            className="inline-flex items-center justify-center rounded-full bg-black px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
                        >
                            Open Tool →
                        </Link>

                        <Link
                            href="/pricing"
                            className="inline-flex items-center justify-center rounded-full border bg-white px-5 py-2 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
                        >
                            Go Pro
                        </Link>
                    </div>

                    <p className="mt-5 text-xs text-neutral-600">
                        No software installation required. Files are processed securely to complete your request and are not kept permanently.
                    </p>
                </div>
            </section>

            <section className="mx-auto max-w-5xl px-4 py-10">
                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-2xl border bg-white p-6 shadow-sm">
                        <h2 className="text-base font-semibold text-neutral-900">When you may need this</h2>
                        <ul className="mt-3 space-y-2 text-sm text-neutral-700">
                            {props.when.map((x) => (
                                <li key={x} className="flex gap-2">
                                    <span className="text-neutral-400">•</span>
                                    <span>{x}</span>
                                </li>
                            ))}
                        </ul>

                        <h2 className="mt-6 text-base font-semibold text-neutral-900">Common problems</h2>
                        <ul className="mt-3 space-y-2 text-sm text-neutral-700">
                            {props.problems.map((x) => (
                                <li key={x} className="flex gap-2">
                                    <span className="text-neutral-400">•</span>
                                    <span>{x}</span>
                                </li>
                            ))}
                        </ul>

                        <h2 className="mt-6 text-base font-semibold text-neutral-900">Simple step-by-step</h2>
                        <ol className="mt-3 space-y-2 text-sm text-neutral-700">
                            {props.steps.map((x) => (
                                <li key={x} className="flex gap-3">
                                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border bg-white text-xs font-semibold">
                                        {props.steps.indexOf(x) + 1}
                                    </span>
                                    <span>{x}</span>
                                </li>
                            ))}
                        </ol>
                    </div>

                    <div className="rounded-2xl border bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-neutral-900">{props.toolTitle}</h2>
                        <p className="mt-1 text-sm text-neutral-600">
                            Use the tool directly below — no downloads, no installs.
                        </p>
                        <div className="mt-4">{props.embed}</div>
                    </div>
                </div>

                <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-neutral-900">FAQ</h2>
                    <div className="mt-4 space-y-4">
                        {props.faq.map((f) => (
                            <div key={f.q} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                                <div className="text-sm font-semibold text-neutral-900">{f.q}</div>
                                <div className="mt-1 text-sm leading-6 text-neutral-600">{f.a}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-10 text-sm text-neutral-600">
                    Related:
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
                        <Link className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-600" href="/tools">
                            All tools
                        </Link>
                        <Link className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-600" href={props.toolHref}>
                            {props.toolTitle}
                        </Link>
                        <Link className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-600" href="/pricing">
                            Pricing
                        </Link>
                        <Link className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-600" href="/privacy">
                            Privacy
                        </Link>
                        <Link className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-600" href="/faq">
                            FAQ
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
