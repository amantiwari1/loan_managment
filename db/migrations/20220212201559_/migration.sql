-- CreateTable
CREATE TABLE "Teaser" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "data" JSONB NOT NULL DEFAULT '{}',
    "enquiryId" INTEGER,

    CONSTRAINT "Teaser_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Teaser" ADD CONSTRAINT "Teaser_enquiryId_fkey" FOREIGN KEY ("enquiryId") REFERENCES "Enquiry"("id") ON DELETE SET NULL ON UPDATE CASCADE;
