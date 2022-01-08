/*
  Warnings:

  - You are about to drop the column `Status` on the `BankQuery` table. All the data in the column will be lost.
  - You are about to drop the column `Status` on the `SanctionDisbursment` table. All the data in the column will be lost.
  - You are about to drop the column `Status` on the `SearchValuationReport` table. All the data in the column will be lost.
  - Added the required column `status` to the `BankQuery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `SanctionDisbursment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `SearchValuationReport` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BankQuery" DROP COLUMN "Status",
ADD COLUMN     "status" "StatusType" NOT NULL;

-- AlterTable
ALTER TABLE "SanctionDisbursment" DROP COLUMN "Status",
ADD COLUMN     "status" "StatusType" NOT NULL;

-- AlterTable
ALTER TABLE "SearchValuationReport" DROP COLUMN "Status",
ADD COLUMN     "status" "StatusType" NOT NULL;
