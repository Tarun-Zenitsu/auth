import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { applicationId, technicalUserId } = body;

    if (!applicationId || !technicalUserId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Ensure application exists
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Ensure user is a technical team member
    const techUser = await prisma.user.findUnique({
      where: { id: technicalUserId },
    });

    if (!techUser || techUser.role !== "TECHNICAL_TEAM") {
      return NextResponse.json(
        { error: "Invalid technical team member" },
        { status: 400 }
      );
    }

    // Update application
    const updatedApplication = await prisma.application.update({
      where: { id: applicationId },
      data: {
        assignedToTechId: technicalUserId,
      },
      include: {
        candidate: true,
        job: true,
      },
    });

    return NextResponse.json({
      message: "Application assigned successfully",
      application: updatedApplication,
    });
  } catch (error) {
    console.error("Assignment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
