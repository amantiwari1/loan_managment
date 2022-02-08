-- DropForeignKey
ALTER TABLE "CaseStatus" DROP CONSTRAINT "CaseStatus_fileId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectReport" DROP CONSTRAINT "ProjectReport_fileId_fkey";

-- DropForeignKey
ALTER TABLE "SearchValuationReport" DROP CONSTRAINT "SearchValuationReport_fileId_fkey";

-- AlterTable
ALTER TABLE "CaseStatus" ALTER COLUMN "fileId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ProjectReport" ALTER COLUMN "fileId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "SearchValuationReport" ALTER COLUMN "fileId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ProjectReport" ADD CONSTRAINT "ProjectReport_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseStatus" ADD CONSTRAINT "CaseStatus_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SearchValuationReport" ADD CONSTRAINT "SearchValuationReport_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;
