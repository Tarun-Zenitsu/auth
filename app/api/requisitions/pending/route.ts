import { NextResponse } from "next/server";
import { auth } from "@/auth"; // Ensure this is your NextAuth helper
import prisma from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session || !["ADMIN", "HIRING_MANAGER"].includes(session.user.role)) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const requisitions = await prisma.requisition.findMany({
    where: {
      status: "PENDING_APPROVAL",
    },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(requisitions);
}
