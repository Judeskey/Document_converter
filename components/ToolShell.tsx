export default function ToolShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6 sm:p-10">
            <div className="mx-auto max-w-3xl">{children}</div>
        </div>
    );
}
