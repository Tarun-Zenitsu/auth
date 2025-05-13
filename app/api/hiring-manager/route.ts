import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Total job requisitions
    const totalRequisitions = await prisma.requisition.count();

    // Requisitions pending approval
    const pendingUsers = await prisma.requisition.count({
      where: { status: "PENDING_APPROVAL" },
    });

    // Approved job requisitions
    const openPositions = await prisma.requisition.count({
      where: { status: "APPROVED" },
    });

    // Approved job requisitions closing soon (in next 7 days)
    const closingSoon = await prisma.requisition.count({
      where: {
        status: "APPROVED",
        expiresAt: {
          lte: new Date(new Date().setDate(new Date().getDate() + 7)),
        },
      },
    });

    // Total applications
    const totalCandidates = await prisma.application.count();

    // Applications in interview stage
    const interviewing = await prisma.application.count({
      where: { status: "INTERVIEW_STAGE" },
    });

    // Progress = % of requisitions that have at least one application
    const requisitionsWithApps = await prisma.requisition.count({
      where: {
        applications: {
          some: {},
        },
      },
    });

    const progress = totalRequisitions
      ? Math.round((requisitionsWithApps / totalRequisitions) * 100)
      : 0;

    return NextResponse.json({
      totalUsers: totalRequisitions,
      pendingUsers,
      openPositions,
      closingSoon,
      totalCandidates,
      interviewing,
      progress,
    });
  } catch (error) {
    console.error("Error fetching hiring manager metrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch metrics" },
      { status: 500 }
    );
  }
}
