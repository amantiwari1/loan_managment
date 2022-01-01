/*
  Warnings:

  - Added the required column `client_address` to the `Enquiry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `client_email` to the `Enquiry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `client_mobile` to the `Enquiry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `client_name` to the `Enquiry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `client_qccupation_type` to the `Enquiry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `client_service` to the `Enquiry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `loan_amount` to the `Enquiry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `private_enquiry` to the `Enquiry` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ClientServiceType" AS ENUM ('HOME_LOAN', 'MORTGAGE_LOAN', 'UNSECURED_LOAN', 'MSME_LOAN', 'STARTUP_LOAN', 'SUBSIDY_SCHEMES');

-- CreateEnum
CREATE TYPE "ClientOccupationType" AS ENUM ('SALARIED_INDIVIDUAL', 'INDIVIDUAL', 'SELF_EMPLOYED_INDIVIDUAL_OR_PROPRIETORSHIP', 'PARTNERSHIP', 'COMPANY');

-- AlterTable
ALTER TABLE "Enquiry" ADD COLUMN     "client_address" TEXT NOT NULL,
ADD COLUMN     "client_email" TEXT NOT NULL,
ADD COLUMN     "client_mobile" TEXT NOT NULL,
ADD COLUMN     "client_name" TEXT NOT NULL,
ADD COLUMN     "client_qccupation_type" "ClientOccupationType" NOT NULL,
ADD COLUMN     "client_service" "ClientServiceType" NOT NULL,
ADD COLUMN     "loan_amount" TEXT NOT NULL,
ADD COLUMN     "private_enquiry" BOOLEAN NOT NULL;
