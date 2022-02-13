/*
  Warnings:

  - You are about to drop the `Teaser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Teaser" DROP CONSTRAINT "Teaser_enquiryId_fkey";

-- DropIndex
DROP INDEX "ChannelPartner_email_key";

-- DropTable
DROP TABLE "Teaser";
