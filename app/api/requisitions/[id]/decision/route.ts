import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth"; // Your NextAuth session handler
import prisma from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const requisitionId = params.id;
  const { status, rejectionReason } = await req.json();

  if (!["APPROVED", "REJECTED"].includes(status)) {
    return new NextResponse("Invalid status", { status: 400 });
  }

  const updateData: any = {
    status,
    approvedById: session.user.id,
  };

  if (status === "REJECTED") {
    if (!rejectionReason || rejectionReason.trim().length < 3) {
      return new NextResponse("Rejection reason required", { status: 400 });
    }
    updateData.rejectionReason = rejectionReason;
  }

  const updated = await prisma.requisition.update({
    where: { id: requisitionId },
    data: updateData,
  });

  return NextResponse.json(updated);
}
