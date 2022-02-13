/*
  Warnings:

  - A unique constraint covering the columns `[enquiryId]` on the table `Teaser` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Teaser" ALTER COLUMN "data" SET DEFAULT '{}';

-- CreateIndex
CREATE UNIQUE INDEX "Teaser_enquiryId_key" ON "Teaser"("enquiryId");
