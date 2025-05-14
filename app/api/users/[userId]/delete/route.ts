// app/api/users/[userId]/delete/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth"; // Adjust the import path based on your project structure
import prisma from "@/lib/db"; // Adjust the import path based on your project structure
import { UserRole } from "@prisma/client";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await context.params;

    // Authenticate the user
    const session = await auth();

    // Check if the user is authenticated and has the ADMIN role
    if (!session || session.user.role !== UserRole.ADMIN) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // Proceed to delete the user
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Failed to delete user:", error);
    return new NextResponse("Error deleting user", { status: 500 });
  }
}
