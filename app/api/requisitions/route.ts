import { auth } from "@/auth";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

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

export async function GET() {
  const session = await auth();

  if (!session || !["RECRUITER", "ADMIN"].includes(session.user.role)) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const requisitions = await prisma.requisition.findMany({
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
}
