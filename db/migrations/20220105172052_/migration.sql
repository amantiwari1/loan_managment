/*
  Warnings:

  - You are about to drop the column `Status` on the `Document` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Document" DROP COLUMN "Status",
ADD COLUMN     "status" "StatusType" NOT NULL DEFAULT E'NOT_UPLOAD';
