import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const [
      totalUsers,
      pendingUsers,
      totalCandidates,
      interviewingCandidates,
      approvedRequisitions,
      closingSoonRequisitions,
      totalApplications,
      inProgressApplications,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isVerified: false } }),
      prisma.user.count({ where: { role: "CANDIDATE" } }),
      prisma.application.count({ where: { status: "INTERVIEW_STAGE" } }),
      prisma.requisition.count({ where: { status: "APPROVED" } }),
      prisma.requisition.count({
        where: {
          status: "APPROVED",
          expiresAt: {
            lte: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // expires in next 3 days
          },
        },
      }),
      prisma.application.count(),
      prisma.application.count({
        where: {
          NOT: {
            status: "SUBMITTED",
          },
        },
      }),
    ]);

    const applicationProgress =
      totalApplications > 0
        ? Math.round((inProgressApplications / totalApplications) * 100)
        : 0;

    return NextResponse.json({
      totalUsers,
      pendingUsers,
      totalCandidates,
      interviewing: interviewingCandidates,
      openJobs: approvedRequisitions,
      closingSoon: closingSoonRequisitions,
      applicationProgress,
    });
  } catch (error) {
    console.error("Error fetching metrics:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
