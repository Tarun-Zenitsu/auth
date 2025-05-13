import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || !["ADMIN", "HIRING_MANAGER"].includes(session.user.role)) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const { id } = await params; // Await the params to resolve the Promise

  const { status, rejectionReason } = await req.json();

  if (!["APPROVED", "REJECTED"].includes(status)) {
    return new NextResponse("Invalid status", { status: 400 });
  }

  const updateData: Prisma.RequisitionUpdateInput = {
    status,
    approvedBy: {
      connect: {
        id: session.user.id,
      },
    },
  };

  if (status === "REJECTED") {
    if (!rejectionReason || rejectionReason.trim().length < 3) {
      return new NextResponse("Rejection reason required", { status: 400 });
    }
    updateData.rejectionReason = rejectionReason;
  }

  const updated = await prisma.requisition.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json(updated);
}
