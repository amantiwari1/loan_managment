-- AlterTable
ALTER TABLE "CaseStatus" ADD COLUMN     "case_status" TEXT;

-- AlterTable
ALTER TABLE "Teaser" ALTER COLUMN "data" SET DEFAULT '{}';
