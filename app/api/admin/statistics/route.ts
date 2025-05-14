import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const [total, shortlisted, rejected, hold, interview, appsPerJobRaw] =
      await Promise.all([
        prisma.application.count(),
        prisma.application.count({ where: { status: "SHORTLISTED" } }),
        prisma.application.count({ where: { status: "REJECTED" } }),
        prisma.application.count({ where: { status: "HOLD" } }),
        prisma.application.count({ where: { status: "INTERVIEW_STAGE" } }),
        prisma.application.groupBy({
          by: ["jobId"],
          _count: { jobId: true },
          orderBy: {
            _count: {
              jobId: "desc",
            },
          },
        }),
      ]);

    const jobIds = appsPerJobRaw.map((a) => a.jobId);
    const jobs = await prisma.requisition.findMany({
      where: { id: { in: jobIds } },
      select: { id: true, jobTitle: true },
    });

    const jobMap = Object.fromEntries(jobs.map((j) => [j.id, j.jobTitle]));

    const appsPerJob = appsPerJobRaw.map((item) => ({
      jobTitle: jobMap[item.jobId] || "Unknown",
      count: item._count.jobId,
    }));

    return NextResponse.json({
      metrics: {
        total,
        shortlisted,
        rejected,
        hold,
        interview,
      },
      appsPerJob,
    });
  } catch (error) {
    console.error("Error fetching admin statistics:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
