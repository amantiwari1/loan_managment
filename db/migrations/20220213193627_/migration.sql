/*
  Warnings:

  - You are about to drop the column `fileId` on the `CaseStatus` table. All the data in the column will be lost.
  - You are about to drop the column `response_from_bank` on the `CaseStatus` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `CaseStatus` table. All the data in the column will be lost.
  - Changed the type of `final_login` on the `CaseStatus` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "CaseStatus" DROP CONSTRAINT "CaseStatus_fileId_fkey";

-- AlterTable
ALTER TABLE "CaseStatus" DROP COLUMN "fileId",
DROP COLUMN "response_from_bank",
DROP COLUMN "status",
DROP COLUMN "final_login",
ADD COLUMN     "final_login" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "Teaser" ALTER COLUMN "data" SET DEFAULT '{}';
