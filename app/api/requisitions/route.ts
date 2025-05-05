// import prisma from "@/lib/db";

// // route.ts
// export async function POST(req: Request) {
//   const body = await req.json();

//   const requisition = await prisma.requisition.create({
//     data: {
//       jobTitle: body.jobTitle,
//       department: body.department,
//       budgetCode: body.budgetCode,
//       justification: body.justification,
//       openings: body.openings,
//       skillTags: body.skillTags,
//       urgency: body.urgency,
//       location: body.location,
//       salaryRange: body.salaryRange,
//       jobDescription: body.jobDescription,
//       createdById: body.userId, // from session
//     },
//   });

//   return Response.json(requisition);
// }
