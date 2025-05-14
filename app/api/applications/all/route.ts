// /api/applications/all.ts

import { auth } from "@/auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  try {
    const applications = await prisma.application.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        candidate: {
          select: {
            name: true,
            email: true,
          },
        },
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
    console.error("Error fetching all applications:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
