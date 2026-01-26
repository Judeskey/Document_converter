/*
  Warnings:

  - You are about to drop the column `currentPeriodEnd` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isPro` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `stripeStatus` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "currentPeriodEnd",
DROP COLUMN "emailVerified",
DROP COLUMN "isPro",
DROP COLUMN "stripeStatus",
ADD COLUMN     "plan" TEXT NOT NULL DEFAULT 'FREE',
ADD COLUMN     "stripeCurrentPeriodEnd" TIMESTAMP(3),
ADD COLUMN     "subscriptionStatus" TEXT;
