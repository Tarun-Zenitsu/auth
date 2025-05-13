import { auth } from "@/auth";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { RequisitionStatus } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      jobTitle,
      department,
      budgetCode,
      justification,
      skillTags,
      urgency,
      location,
      salaryRange,
      jobDescription,
      createdById,
      openings,
    } = body;

    // Basic validation
    if (!jobTitle || !department || !createdById) {
      return NextResponse.json(
        {
          message: "Missing required fields: jobTitle, department, createdById",
        },
        { status: 400 }
      );
    }

    const requisition = await prisma.requisition.create({
      data: {
        jobTitle,
        department,
        budgetCode,
        justification,
        skillTags,
        urgency,
        location,
        salaryRange,
        jobDescription,
        openings,
        createdById,
        status: RequisitionStatus.PENDING_APPROVAL, // ✅ Ensure initial status is PENDING
      },
    });

    return NextResponse.json(requisition, { status: 201 });
  } catch (error) {
    console.error("Error creating requisition:", error);
    return NextResponse.json(
      { message: "Error creating requisition" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const session = await auth();

  if (
    !session ||
    !["RECRUITER", "ADMIN", "HIRING_MANAGER"].includes(session.user.role)
  ) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");

  try {
    const requisitions = await prisma.requisition.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        createdBy: {
          select: { name: true, email: true },
        },
        approvedBy: {
          select: { name: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(requisitions);
  } catch (error) {
    console.error("Error fetching requisitions:", error);
    return NextResponse.json(
      { message: "Error fetching requisitions" },
      { status: 500 }
    );
  }
}
