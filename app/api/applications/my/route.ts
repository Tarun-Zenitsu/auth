import { auth } from "@/auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  const session = await auth();

  // Ensure user is authenticated and is a candidate
  if (!session || session.user.role !== "CANDIDATE") {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  try {
    const applications = await prisma.application.findMany({
      where: {
        candidateId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        job: {
          select: {
            jobTitle: true,
            department: true,
            location: true,
          },
        },
      },
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error("Error fetching candidate applications:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
