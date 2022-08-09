-- AlterTable
ALTER TABLE "File" ADD COLUMN     "teaserId" INTEGER;

-- AlterTable
ALTER TABLE "Teaser" ALTER COLUMN "data" SET DEFAULT '{}';

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_teaserId_fkey" FOREIGN KEY ("teaserId") REFERENCES "Teaser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
