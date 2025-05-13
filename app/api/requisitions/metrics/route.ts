import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const now = new Date();
  const inThreeDays = new Date();
  inThreeDays.setDate(now.getDate() + 3);

  // Open and closing soon positions
  const openPositions = await prisma.requisition
    .count
    //     {
    // where: {
    //   status: "APPROVED",
    //   posted: true,
    // },
    //     }
    ();

  const closingSoon = await prisma.requisition.count({
    where: {
      status: "APPROVED",
      posted: true,
      expiresAt: {
        lte: inThreeDays,
        gte: now,
      },
    },
  });

  // Applications
  const totalCandidates = await prisma.application.count();
  const interviewing = await prisma.application.count({
    where: { status: "INTERVIEW_STAGE" },
  });

  // Interviews scheduled today (using review status/times)
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  const interviewsToday = await prisma.technicalReview.count({
    where: {
      reviewedAt: {
        gte: startOfDay,
        lt: endOfDay,
      },
    },
  });

  const nextInterview = await prisma.technicalReview.findFirst({
    where: {
      reviewedAt: {
        gte: now,
      },
    },
    orderBy: {
      reviewedAt: "asc",
    },
  });

  // Progress metric: e.g., completed reviews / total applications
  const completedReviews = await prisma.technicalReview.count({
    where: { status: "COMPLETED" },
  });

  const progress = totalCandidates
    ? Math.round((completedReviews / totalCandidates) * 100)
    : 0;

  return NextResponse.json({
    openPositions,
    closingSoon,
    totalCandidates,
    interviewing,
    interviewsToday,
    nextInterviewTime: nextInterview?.reviewedAt
      ? nextInterview.reviewedAt.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : null,
    progress,
  });
}
