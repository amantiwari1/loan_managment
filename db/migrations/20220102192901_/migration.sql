/*
  Warnings:

  - You are about to drop the column `userId` on the `BankQuery` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `CaseStatus` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Log` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `ProjectReport` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `SanctionDisbursment` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `SearchValuationReport` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "BankQuery" DROP CONSTRAINT "BankQuery_userId_fkey";

-- DropForeignKey
ALTER TABLE "CaseStatus" DROP CONSTRAINT "CaseStatus_userId_fkey";

-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_userId_fkey";

-- DropForeignKey
ALTER TABLE "Log" DROP CONSTRAINT "Log_userId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectReport" DROP CONSTRAINT "ProjectReport_userId_fkey";

-- DropForeignKey
ALTER TABLE "SanctionDisbursment" DROP CONSTRAINT "SanctionDisbursment_userId_fkey";

-- DropForeignKey
ALTER TABLE "SearchValuationReport" DROP CONSTRAINT "SearchValuationReport_userId_fkey";

-- AlterTable
ALTER TABLE "BankQuery" DROP COLUMN "userId",
ADD COLUMN     "enquiryId" INTEGER;

-- AlterTable
ALTER TABLE "CaseStatus" DROP COLUMN "userId",
ADD COLUMN     "enquiryId" INTEGER;

-- AlterTable
ALTER TABLE "Document" DROP COLUMN "userId",
ADD COLUMN     "enquiryId" INTEGER;

-- AlterTable
ALTER TABLE "Log" DROP COLUMN "userId",
ADD COLUMN     "enquiryId" INTEGER;

-- AlterTable
ALTER TABLE "ProjectReport" DROP COLUMN "userId",
ADD COLUMN     "enquiryId" INTEGER;

-- AlterTable
ALTER TABLE "SanctionDisbursment" DROP COLUMN "userId",
ADD COLUMN     "enquiryId" INTEGER;

-- AlterTable
ALTER TABLE "SearchValuationReport" DROP COLUMN "userId",
ADD COLUMN     "enquiryId" INTEGER;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_enquiryId_fkey" FOREIGN KEY ("enquiryId") REFERENCES "Enquiry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_enquiryId_fkey" FOREIGN KEY ("enquiryId") REFERENCES "Enquiry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectReport" ADD CONSTRAINT "ProjectReport_enquiryId_fkey" FOREIGN KEY ("enquiryId") REFERENCES "Enquiry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseStatus" ADD CONSTRAINT "CaseStatus_enquiryId_fkey" FOREIGN KEY ("enquiryId") REFERENCES "Enquiry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SearchValuationReport" ADD CONSTRAINT "SearchValuationReport_enquiryId_fkey" FOREIGN KEY ("enquiryId") REFERENCES "Enquiry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankQuery" ADD CONSTRAINT "BankQuery_enquiryId_fkey" FOREIGN KEY ("enquiryId") REFERENCES "Enquiry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SanctionDisbursment" ADD CONSTRAINT "SanctionDisbursment_enquiryId_fkey" FOREIGN KEY ("enquiryId") REFERENCES "Enquiry"("id") ON DELETE SET NULL ON UPDATE CASCADE;
