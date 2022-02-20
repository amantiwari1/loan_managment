/*
  Warnings:

  - The `rate_of_interest` column on the `SanctionDisbursment` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "SanctionDisbursment" DROP COLUMN "rate_of_interest",
ADD COLUMN     "rate_of_interest" DECIMAL(65,30);

-- AlterTable
ALTER TABLE "Teaser" ALTER COLUMN "data" SET DEFAULT '{}';
