/*
  Warnings:

  - Changed the type of `client_mobile` on the `Enquiry` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `loan_amount` on the `Enquiry` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Enquiry" DROP COLUMN "client_mobile",
ADD COLUMN     "client_mobile" BIGINT NOT NULL,
DROP COLUMN "loan_amount",
ADD COLUMN     "loan_amount" BIGINT NOT NULL;
