import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (
    !session ||
    (session.user.role !== "RECRUITER" && session.user.role !== "ADMIN")
  ) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const { id } = await params;
  const { status, notes } = await req.json();

  const validStatuses = ["SHORTLISTED", "REJECTED", "HOLD"];
  if (!validStatuses.includes(status)) {
    return new NextResponse("Invalid status", { status: 400 });
  }

  const updated = await prisma.application.update({
    where: { id },
    data: {
      status,
      recruiterNotes: notes,
      reviewedBy: { connect: { id: session.user.id } },
      reviewedAt: new Date(),
    },
    include: {
      candidate: true,
      job: true,
    },
  });

  return NextResponse.json(updated);
}
