/*
  Warnings:

  - You are about to drop the `_DocumentToFile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_DocumentToFile" DROP CONSTRAINT "_DocumentToFile_A_fkey";

-- DropForeignKey
ALTER TABLE "_DocumentToFile" DROP CONSTRAINT "_DocumentToFile_B_fkey";

-- AlterTable
ALTER TABLE "File" ADD COLUMN     "documentId" INTEGER;

-- AlterTable
ALTER TABLE "Teaser" ALTER COLUMN "data" SET DEFAULT '{}';

-- DropTable
DROP TABLE "_DocumentToFile";

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE SET NULL ON UPDATE CASCADE;
