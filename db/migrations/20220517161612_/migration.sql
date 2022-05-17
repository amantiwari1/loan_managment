-- AlterTable
ALTER TABLE "BankQuery" ADD COLUMN     "bank_code" TEXT;

-- AlterTable
ALTER TABLE "CaseStatus" ADD COLUMN     "bank_code" TEXT;

-- AlterTable
ALTER TABLE "Teaser" ALTER COLUMN "data" SET DEFAULT '{}';
