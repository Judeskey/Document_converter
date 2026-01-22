/*
  Warnings:

  - You are about to drop the column `usedAt` on the `ToolUsage` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tool,visitorId]` on the table `ToolUsage` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tool,userId]` on the table `ToolUsage` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ToolUsage_tool_idx";

-- DropIndex
DROP INDEX "ToolUsage_visitorId_tool_key";

-- AlterTable
ALTER TABLE "ToolUsage" DROP COLUMN "usedAt",
ADD COLUMN     "count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userId" TEXT,
ALTER COLUMN "visitorId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailVerified",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ToolUsage_tool_visitorId_key" ON "ToolUsage"("tool", "visitorId");

-- CreateIndex
CREATE UNIQUE INDEX "ToolUsage_tool_userId_key" ON "ToolUsage"("tool", "userId");

-- AddForeignKey
ALTER TABLE "ToolUsage" ADD CONSTRAINT "ToolUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
