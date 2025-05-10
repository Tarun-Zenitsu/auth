// app/api/users/technical/route.ts
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const techUsers = await prisma.user.findMany({
      where: { role: "TECHNICAL_TEAM" },
      select: { id: true, name: true, email: true },
    });

    return NextResponse.json(techUsers);
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Failed to fetch technical users" },
      { status: 500 }
    );
  }
}
