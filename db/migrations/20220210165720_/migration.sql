/*
  Warnings:

  - Added the required column `company` to the `ChannelPartner` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `phone` on the `ChannelPartner` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "ChannelPartner" ADD COLUMN     "company" TEXT NOT NULL,
DROP COLUMN "phone",
ADD COLUMN     "phone" BIGINT NOT NULL;
