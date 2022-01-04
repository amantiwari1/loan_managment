-- CreateEnum
CREATE TYPE "StatusType" AS ENUM ('UPLOADED', 'NOT_UPLOAD');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "userId" INTEGER;

-- CreateTable
CREATE TABLE "Log" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "client_name" TEXT NOT NULL,
    "document_name" TEXT NOT NULL,
    "date_of_upload" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectReport" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "label" TEXT NOT NULL,
    "status" "StatusType" NOT NULL,
    "remark" TEXT NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "ProjectReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseStatus" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "bank_name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "response_from_bank" BOOLEAN NOT NULL,
    "final_login" TEXT NOT NULL,
    "remark" TEXT NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "CaseStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SearchValuationReport" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "document" TEXT NOT NULL,
    "Status" "StatusType" NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "SearchValuationReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankQuery" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "bank_query" TEXT NOT NULL,
    "Status" "StatusType" NOT NULL,
    "our_response" TEXT NOT NULL,
    "remark" TEXT NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "BankQuery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SanctionDisbursment" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "document" TEXT NOT NULL,
    "Status" "StatusType" NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "SanctionDisbursment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectReport" ADD CONSTRAINT "ProjectReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseStatus" ADD CONSTRAINT "CaseStatus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SearchValuationReport" ADD CONSTRAINT "SearchValuationReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankQuery" ADD CONSTRAINT "BankQuery_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SanctionDisbursment" ADD CONSTRAINT "SanctionDisbursment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
