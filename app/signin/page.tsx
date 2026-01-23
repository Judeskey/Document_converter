import AuthButtons from "@/components/AuthButtons";

export default function SignInPage() {
    return (
        <main className="mx-auto flex min-h-[70vh] max-w-6xl items-center justify-center px-4 py-10">
            <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                <h1 className="text-3xl font-bold tracking-tight">Sign in</h1>
                <p className="mt-2 text-sm text-neutral-600">
                    Sign in to unlock unlimited conversions after your free trial.
                </p>

                <div className="mt-6">
                    <AuthButtons variant="page" callbackUrl="/" />
                </div>
            </div>
        </main>
    );
}
