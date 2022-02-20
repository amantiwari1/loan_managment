-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "description" TEXT,
ADD COLUMN     "remark" TEXT;

-- AlterTable
ALTER TABLE "Teaser" ALTER COLUMN "data" SET DEFAULT '{}';
