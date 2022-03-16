/*
  Warnings:

  - You are about to drop the column `fileId` on the `Document` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Document" DROP COLUMN "fileId";

-- AlterTable
ALTER TABLE "Teaser" ALTER COLUMN "data" SET DEFAULT '{}';
