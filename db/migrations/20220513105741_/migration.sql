-- AlterTable
ALTER TABLE "File" ADD COLUMN     "fileType" TEXT NOT NULL DEFAULT E'pdf';

-- AlterTable
ALTER TABLE "Teaser" ALTER COLUMN "data" SET DEFAULT '{}';
