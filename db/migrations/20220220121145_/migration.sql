-- AlterTable
ALTER TABLE "SanctionDisbursment" ADD COLUMN     "Tenure" TEXT,
ADD COLUMN     "amount_sanctioned" BIGINT,
ADD COLUMN     "bank_name" TEXT,
ADD COLUMN     "client_name" TEXT,
ADD COLUMN     "date_of_sanction" TIMESTAMP(3),
ADD COLUMN     "rate_of_interest" TEXT,
ADD COLUMN     "remark" TEXT;

-- AlterTable
ALTER TABLE "Teaser" ALTER COLUMN "data" SET DEFAULT '{}';
