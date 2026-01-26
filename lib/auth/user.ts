import { auth } from "@/auth"; // adjust if your auth helper is elsewhere

export async function getUserOrNull() {
    const session = await auth();
    return session?.user ?? null;
}
