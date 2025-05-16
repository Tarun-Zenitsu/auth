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

// import { NextResponse } from "next/server";
// import { auth } from "@/auth";
// import prisma from "@/lib/db";

// export async function GET() {
//   const session = await auth();

//   if (!session || session.user.role !== "TECHNICAL_TEAM") {
//     return new NextResponse("Unauthorized", { status: 403 });
//   }

//   const userId = session.user.id;

//   try {
//     const assignedApplications = await prisma.application.findMany({
//       where: {
//         assignedToTechId: userId,
//       },
//       include: {
//         candidate: {
//           select: {
//             name: true,
//             email: true,
//           },
//         },
//         job: {
//           select: {
//             jobTitle: true,
//             department: true,
//             location: true,
//           },
//         },
//       },
//     });

//     return NextResponse.json(assignedApplications);
//   } catch (error) {
//     console.error("API error:", error);
//     return new NextResponse("Server error", { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/db";

export async function GET() {
  const session = await auth();

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const role = session.user.role;
  const userId = session.user.id;

  // Check the user's role and fetch data accordingly
  try {
    if (role === "ADMIN") {
      // Admin can see all assigned applications
      const allApplications = await prisma.application.findMany({
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
        orderBy: {
          updatedAt: "desc",
        },
      });

      return NextResponse.json(allApplications);
    }

    if (role === "TECHNICAL_TEAM") {
      // Technical Team only sees assigned applications
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
    }

    return new NextResponse("Forbidden", { status: 403 });
  } catch (error) {
    console.error("API error:", error);
    return new NextResponse("Server error", { status: 500 });
  }
}
