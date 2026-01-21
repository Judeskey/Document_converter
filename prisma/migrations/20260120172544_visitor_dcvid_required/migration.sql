/*
  Warnings:

  - Made the column `dcVid` on table `Visitor` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Visitor" ALTER COLUMN "dcVid" SET NOT NULL;
