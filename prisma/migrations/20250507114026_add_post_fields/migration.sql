-- AlterTable
ALTER TABLE "Requisition" ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "postChannels" TEXT[],
ADD COLUMN     "posted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "postedAt" TIMESTAMP(3);
