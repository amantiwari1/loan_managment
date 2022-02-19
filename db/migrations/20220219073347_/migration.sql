-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "is_public_user" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Teaser" ALTER COLUMN "data" SET DEFAULT '{}';
