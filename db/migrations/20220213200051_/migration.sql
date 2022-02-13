/*
  Warnings:

  - A unique constraint covering the columns `[bankQueryId]` on the table `CaseStatus` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "CaseStatus" ADD COLUMN     "bankQueryId" INTEGER;

-- AlterTable
ALTER TABLE "Teaser" ALTER COLUMN "data" SET DEFAULT '{}';

-- CreateIndex
CREATE UNIQUE INDEX "CaseStatus_bankQueryId_key" ON "CaseStatus"("bankQueryId");

-- AddForeignKey
ALTER TABLE "CaseStatus" ADD CONSTRAINT "CaseStatus_bankQueryId_fkey" FOREIGN KEY ("bankQueryId") REFERENCES "BankQuery"("id") ON DELETE SET NULL ON UPDATE CASCADE;
