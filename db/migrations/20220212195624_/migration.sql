/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `ChannelPartner` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "Teaser" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "teaser" JSONB NOT NULL DEFAULT '{}',
    "enquiryId" INTEGER,

    CONSTRAINT "Teaser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChannelPartner_email_key" ON "ChannelPartner"("email");

-- AddForeignKey
ALTER TABLE "Teaser" ADD CONSTRAINT "Teaser_enquiryId_fkey" FOREIGN KEY ("enquiryId") REFERENCES "Enquiry"("id") ON DELETE SET NULL ON UPDATE CASCADE;
