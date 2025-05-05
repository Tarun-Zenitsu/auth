-- CreateEnum
CREATE TYPE "RequisitionStatus" AS ENUM ('PENDING_APPROVAL', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "UrgencyLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'AUDITOR', 'RECRUITER', 'HR', 'CANDIDATE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Requisition" (
    "id" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "budgetCode" TEXT NOT NULL,
    "justification" TEXT NOT NULL,
    "openings" INTEGER NOT NULL,
    "skillTags" TEXT[],
    "urgency" "UrgencyLevel" NOT NULL,
    "location" TEXT NOT NULL,
    "salaryRange" TEXT NOT NULL,
    "jobDescription" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "approvedById" TEXT,
    "rejectionReason" TEXT,
    "status" "RequisitionStatus" NOT NULL DEFAULT 'PENDING_APPROVAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Requisition_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Requisition" ADD CONSTRAINT "Requisition_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requisition" ADD CONSTRAINT "Requisition_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
