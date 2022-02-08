-- AlterTable
ALTER TABLE "SanctionDisbursment" ADD COLUMN     "fileId" INTEGER;

-- AddForeignKey
ALTER TABLE "SanctionDisbursment" ADD CONSTRAINT "SanctionDisbursment_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;
