-- AlterTable
ALTER TABLE "SanctionDisbursment" ADD COLUMN     "product" "ClientServiceType";

-- AlterTable
ALTER TABLE "Teaser" ALTER COLUMN "data" SET DEFAULT '{}';
