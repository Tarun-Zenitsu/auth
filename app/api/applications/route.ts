import { NextResponse } from "next/server";
import { auth } from "@/auth"; // your custom NextAuth instance
import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "CANDIDATE") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { jobId, resumeLink, coverLetter } = body;

    if (!jobId || !resumeLink) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // ✅ Check if the candidate has already applied for the same job
    const existingApplication = await prisma.application.findFirst({
      where: {
        candidateId: session.user.id,
        jobId,
      },
    });

    if (existingApplication) {
      return new NextResponse("You have already applied for this job", {
        status: 400,
      });
    }

    const application = await prisma.application.create({
      data: {
        candidateId: session.user.id,
        jobId,
        resumeLink,
        coverLetter,
      },
    });

    return NextResponse.json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    console.error("Application error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// pages/api/applications.ts

export async function GET() {
  const applications = await prisma.application.findMany({
    include: {
      candidate: {
        select: { name: true, email: true },
      },
      job: {
        select: { jobTitle: true },
      },
    },
  });

  return NextResponse.json(applications);
}
