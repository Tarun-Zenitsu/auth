import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || !["ADMIN", "RECRUITER"].includes(session.user.role)) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const { id } = await params;
  const { postChannels, expiresAt } = await req.json();

  const updated = await prisma.requisition.update({
    where: { id },
    data: {
      posted: true,
      postedAt: new Date(),
      postChannels,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    },
  });

  return NextResponse.json(updated);
}
