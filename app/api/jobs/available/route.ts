import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const jobs = await prisma.requisition.findMany({
      where: {
        status: "APPROVED",
        posted: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(jobs);
  } catch (error) {
    console.log(error);
    return new NextResponse("Failed to fetch jobs", { status: 500 });
  }
}
