// import { auth } from "@/auth";
// import { NextResponse } from "next/server";
// import prisma from "@/lib/db";

// export async function GET() {
//   const session = await auth();

//   if (!session || session.user.role !== "TECHNICAL_TEAM") {
//     return new NextResponse("Unauthorized", { status: 403 });
//   }

//   const assignedApplications = await prisma.application.findMany({
//     where: {
//       assignedToTechId: session.user.id, // ✅ Correct field
//     },
//     include: {
//       candidate: {
//         select: {
//           name: true,
//           email: true,
//         },
//       },
//       job: {
//         select: {
//           jobTitle: true,
//           department: true,
//           location: true,
//         },
//       },
//     },
//     orderBy: {
//       createdAt: "desc",
//     },
//   });

//   return NextResponse.json(assignedApplications);
// }

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/db";

export async function GET() {
  const session = await auth();

  if (!session || session.user.role !== "TECHNICAL_TEAM") {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const userId = session.user.id;

  try {
    const assignedApplications = await prisma.application.findMany({
      where: {
        assignedToTechId: userId,
      },
      include: {
        candidate: {
          select: {
            name: true,
            email: true,
          },
        },
        job: {
          select: {
            jobTitle: true,
            department: true,
            location: true,
          },
        },
      },
    });

    return NextResponse.json(assignedApplications);
  } catch (error) {
    console.error("API error:", error);
    return new NextResponse("Server error", { status: 500 });
  }
}
