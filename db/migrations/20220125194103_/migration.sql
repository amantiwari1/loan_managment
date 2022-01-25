-- CreateEnum
CREATE TYPE "EnquiryRequestType" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SANCTIONED');

-- AlterTable
ALTER TABLE "Enquiry" ADD COLUMN     "enquiry_request" "EnquiryRequestType" NOT NULL DEFAULT E'PENDING';
