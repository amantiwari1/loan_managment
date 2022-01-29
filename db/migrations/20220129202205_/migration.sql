/*
  Warnings:

  - A unique constraint covering the columns `[client_email]` on the table `Enquiry` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Enquiry_client_email_key" ON "Enquiry"("client_email");
