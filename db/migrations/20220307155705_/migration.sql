-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_fileId_fkey";

-- AlterTable
ALTER TABLE "Teaser" ALTER COLUMN "data" SET DEFAULT '{}';

-- CreateTable
CREATE TABLE "_DocumentToFile" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_DocumentToFile_AB_unique" ON "_DocumentToFile"("A", "B");

-- CreateIndex
CREATE INDEX "_DocumentToFile_B_index" ON "_DocumentToFile"("B");

-- AddForeignKey
ALTER TABLE "_DocumentToFile" ADD FOREIGN KEY ("A") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocumentToFile" ADD FOREIGN KEY ("B") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;
