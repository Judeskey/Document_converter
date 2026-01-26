import { prisma } from "@/lib/db";

const DEFAULT_FREE_USES = 1;

export async function canUseTool(args: { userId: string; tool: string }) {
    const { userId, tool } = args;

    // Uses your schema: @@unique([tool, userId])
    const row = await prisma.toolUsage.findUnique({
        where: { tool_userId: { tool, userId } },
        select: { count: true },
    });

    const used = row?.count ?? 0;
    return used < DEFAULT_FREE_USES;
}
