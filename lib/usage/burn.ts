import { prisma } from "@/lib/db";

export async function burnToolUsage({
    user,
    tool,
}: {
    user: any;
    tool: string;
}) {
    if (!user?.id) return;

    await prisma.toolUsage.upsert({
        where: {
            tool_userId: {
                tool,
                userId: user.id,
            },
        },
        create: {
            tool,
            userId: user.id,
            count: 1,
        },
        update: {
            count: { increment: 1 },
        },
    });
}
