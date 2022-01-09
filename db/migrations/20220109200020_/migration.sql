/*
  Warnings:

  - You are about to drop the column `userId` on the `Enquiry` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Enquiry" DROP CONSTRAINT "Enquiry_userId_fkey";

-- DropIndex
DROP INDEX "Enquiry_userId_key";

-- AlterTable
ALTER TABLE "Enquiry" DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "UsersOnEnquires" (
    "userId" INTEGER NOT NULL,
    "enquiryId" INTEGER NOT NULL,

    CONSTRAINT "UsersOnEnquires_pkey" PRIMARY KEY ("userId","enquiryId")
);

-- AddForeignKey
ALTER TABLE "UsersOnEnquires" ADD CONSTRAINT "UsersOnEnquires_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersOnEnquires" ADD CONSTRAINT "UsersOnEnquires_enquiryId_fkey" FOREIGN KEY ("enquiryId") REFERENCES "Enquiry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
