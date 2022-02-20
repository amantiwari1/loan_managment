/*
  Warnings:

  - You are about to drop the column `Tenure` on the `SanctionDisbursment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SanctionDisbursment" DROP COLUMN "Tenure",
ADD COLUMN     "tenure" TEXT;

-- AlterTable
ALTER TABLE "Teaser" ALTER COLUMN "data" SET DEFAULT '{}';
