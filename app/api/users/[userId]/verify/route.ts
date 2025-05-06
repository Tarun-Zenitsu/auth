import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  const { userId } = await context.params;

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { isVerified: true },
    });

    return NextResponse.json({ message: "User verified" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to verify user" },
      { status: 500 }
    );
  }
}
