/*
  Warnings:

  - Added the required column `fileId` to the `CaseStatus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileId` to the `ProjectReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileId` to the `SearchValuationReport` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CaseStatus" ADD COLUMN     "fileId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ProjectReport" ADD COLUMN     "fileId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "SearchValuationReport" ADD COLUMN     "fileId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ProjectReport" ADD CONSTRAINT "ProjectReport_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseStatus" ADD CONSTRAINT "CaseStatus_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SearchValuationReport" ADD CONSTRAINT "SearchValuationReport_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
