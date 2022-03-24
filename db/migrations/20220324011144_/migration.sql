-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('RESET_PASSWORD', 'INVITE_PASSWORD');

-- CreateEnum
CREATE TYPE "EnquiryRequestType" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SANCTIONED');

-- CreateEnum
CREATE TYPE "StatusType" AS ENUM ('UPLOADED', 'NOT_UPLOAD');

-- CreateEnum
CREATE TYPE "ClientServiceType" AS ENUM ('HOME_LOAN', 'MORTGAGE_LOAN', 'UNSECURED_LOAN', 'MSME_LOAN', 'STARTUP_LOAN', 'SUBSIDY_SCHEMES');

-- CreateEnum
CREATE TYPE "ClientOccupationType" AS ENUM ('SALARIED_INDIVIDUAL', 'INDIVIDUAL', 'SELF_EMPLOYED_INDIVIDUAL_OR_PROPRIETORSHIP', 'PARTNERSHIP', 'COMPANY');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT,
    "role" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsersOnEnquires" (
    "userId" INTEGER NOT NULL,
    "enquiryId" INTEGER NOT NULL,

    CONSTRAINT "UsersOnEnquires_pkey" PRIMARY KEY ("userId","enquiryId")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "handle" TEXT NOT NULL,
    "hashedSessionToken" TEXT,
    "antiCSRFToken" TEXT,
    "publicData" TEXT,
    "privateData" TEXT,
    "userId" INTEGER,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "hashedToken" TEXT NOT NULL,
    "type" "TokenType" NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "sentTo" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enquiry" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "client_address" TEXT NOT NULL,
    "client_email" TEXT NOT NULL,
    "client_name" TEXT NOT NULL,
    "client_qccupation_type" "ClientOccupationType" NOT NULL,
    "client_service" "ClientServiceType" NOT NULL,
    "private_enquiry" BOOLEAN NOT NULL,
    "client_mobile" BIGINT NOT NULL,
    "loan_amount" BIGINT NOT NULL,
    "enquiry_request" "EnquiryRequestType" NOT NULL DEFAULT E'PENDING',

    CONSTRAINT "Enquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "documentId" INTEGER,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Log" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "enquiryId" INTEGER,
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
    "remark" TEXT,
    "description" TEXT,
    "enquiryId" INTEGER,
    "status" "StatusType" NOT NULL DEFAULT E'NOT_UPLOAD',
    "is_public_user" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectReport" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "label" TEXT NOT NULL,
    "status" "StatusType" NOT NULL DEFAULT E'NOT_UPLOAD',
    "remark" TEXT,
    "enquiryId" INTEGER,
    "fileId" INTEGER,

    CONSTRAINT "ProjectReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseStatus" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "bank_name" TEXT NOT NULL,
    "final_login" BOOLEAN NOT NULL,
    "remark" TEXT,
    "enquiryId" INTEGER,
    "bankQueryId" INTEGER,

    CONSTRAINT "CaseStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SearchValuationReport" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "document" TEXT NOT NULL,
    "enquiryId" INTEGER,
    "status" "StatusType" NOT NULL DEFAULT E'NOT_UPLOAD',
    "fileId" INTEGER,

    CONSTRAINT "SearchValuationReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankQuery" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "bank_query" TEXT NOT NULL,
    "our_response" TEXT NOT NULL,
    "remark" TEXT,
    "enquiryId" INTEGER,
    "status" "StatusType" NOT NULL DEFAULT E'NOT_UPLOAD',

    CONSTRAINT "BankQuery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SanctionDisbursment" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "document" TEXT NOT NULL,
    "client_name" TEXT,
    "date_of_sanction" TIMESTAMP(3),
    "product" "ClientServiceType",
    "amount_sanctioned" BIGINT,
    "bank_name" TEXT,
    "rate_of_interest" DECIMAL(65,30),
    "tenure" TEXT,
    "remark" TEXT,
    "enquiryId" INTEGER,
    "status" "StatusType" NOT NULL DEFAULT E'NOT_UPLOAD',
    "fileId" INTEGER,

    CONSTRAINT "SanctionDisbursment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChannelPartner" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "request" "EnquiryRequestType" NOT NULL DEFAULT E'PENDING',
    "company" TEXT NOT NULL,
    "phone" BIGINT NOT NULL,

    CONSTRAINT "ChannelPartner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teaser" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "data" JSONB NOT NULL DEFAULT '{}',
    "enquiryId" INTEGER,

    CONSTRAINT "Teaser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_handle_key" ON "Session"("handle");

-- CreateIndex
CREATE UNIQUE INDEX "Token_hashedToken_type_key" ON "Token"("hashedToken", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Enquiry_client_email_key" ON "Enquiry"("client_email");

-- CreateIndex
CREATE UNIQUE INDEX "CaseStatus_bankQueryId_key" ON "CaseStatus"("bankQueryId");

-- CreateIndex
CREATE UNIQUE INDEX "Teaser_enquiryId_key" ON "Teaser"("enquiryId");

-- AddForeignKey
ALTER TABLE "UsersOnEnquires" ADD CONSTRAINT "UsersOnEnquires_enquiryId_fkey" FOREIGN KEY ("enquiryId") REFERENCES "Enquiry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersOnEnquires" ADD CONSTRAINT "UsersOnEnquires_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_enquiryId_fkey" FOREIGN KEY ("enquiryId") REFERENCES "Enquiry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_enquiryId_fkey" FOREIGN KEY ("enquiryId") REFERENCES "Enquiry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectReport" ADD CONSTRAINT "ProjectReport_enquiryId_fkey" FOREIGN KEY ("enquiryId") REFERENCES "Enquiry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectReport" ADD CONSTRAINT "ProjectReport_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseStatus" ADD CONSTRAINT "CaseStatus_bankQueryId_fkey" FOREIGN KEY ("bankQueryId") REFERENCES "BankQuery"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseStatus" ADD CONSTRAINT "CaseStatus_enquiryId_fkey" FOREIGN KEY ("enquiryId") REFERENCES "Enquiry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SearchValuationReport" ADD CONSTRAINT "SearchValuationReport_enquiryId_fkey" FOREIGN KEY ("enquiryId") REFERENCES "Enquiry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SearchValuationReport" ADD CONSTRAINT "SearchValuationReport_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankQuery" ADD CONSTRAINT "BankQuery_enquiryId_fkey" FOREIGN KEY ("enquiryId") REFERENCES "Enquiry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SanctionDisbursment" ADD CONSTRAINT "SanctionDisbursment_enquiryId_fkey" FOREIGN KEY ("enquiryId") REFERENCES "Enquiry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SanctionDisbursment" ADD CONSTRAINT "SanctionDisbursment_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teaser" ADD CONSTRAINT "Teaser_enquiryId_fkey" FOREIGN KEY ("enquiryId") REFERENCES "Enquiry"("id") ON DELETE SET NULL ON UPDATE CASCADE;
