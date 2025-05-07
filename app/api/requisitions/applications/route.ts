import { auth } from "@/auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  const session = await auth();

  if (!session?.user || session.user.role !== "RECRUITER" || "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const applications = await prisma.application.findMany({
    where: {
      job: {
        createdById: session.user.id,
      },
    },
    include: {
      candidate: true,
      job: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(applications);
}
