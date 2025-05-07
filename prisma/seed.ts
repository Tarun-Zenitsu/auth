import {
  PrismaClient,
  UserRole,
  RequisitionStatus,
  UrgencyLevel,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Create Users
  const hiringManager = await prisma.user.create({
    data: {
      name: "Alice Hiring Manager",
      email: "alice.hiring@example.com",
      role: UserRole.HIRING_MANAGER,
    },
  });

  const recruiter = await prisma.user.create({
    data: {
      name: "Mark Recruiter",
      email: "mark.recruiter@example.com",
      role: UserRole.RECRUITER,
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: "Sarah Admin",
      email: "sarah.admin@example.com",
      role: UserRole.ADMIN,
    },
  });

  // Create Requisitions
  await prisma.requisition.create({
    data: {
      jobTitle: "Frontend Developer",
      department: "Engineering",
      budgetCode: "ENG-2025-FRONT",
      justification: "Product expansion",
      openings: 2,
      skillTags: ["React", "TypeScript"],
      urgency: UrgencyLevel.HIGH,
      location: "Remote",
      salaryRange: "$80k - $100k",
      jobDescription: "Looking for experienced React developer.",
      createdBy: { connect: { id: hiringManager.id } },
      approvedBy: { connect: { id: admin.id } },
      status: RequisitionStatus.APPROVED,
    },
  });

  await prisma.requisition.create({
    data: {
      jobTitle: "Backend Developer",
      department: "Engineering",
      budgetCode: "ENG-2025-BACK",
      justification: "System scalability",
      openings: 1,
      skillTags: ["Node.js", "PostgreSQL"],
      urgency: UrgencyLevel.MEDIUM,
      location: "On-site",
      salaryRange: "$90k - $110k",
      jobDescription: "Looking for Node.js backend engineer.",
      createdBy: { connect: { id: recruiter.id } },
      status: RequisitionStatus.PENDING_APPROVAL,
    },
  });

  await prisma.requisition.create({
    data: {
      jobTitle: "UX Designer",
      department: "Design",
      budgetCode: "DES-2025-UX",
      justification: "UI overhaul",
      openings: 1,
      skillTags: ["Figma", "UX Research"],
      urgency: UrgencyLevel.LOW,
      location: "Hybrid",
      salaryRange: "$70k - $85k",
      jobDescription: "Experienced UX designer needed for redesign.",
      createdBy: { connect: { id: hiringManager.id } },
      approvedBy: { connect: { id: admin.id } },
      status: RequisitionStatus.REJECTED,
      rejectionReason: "Budget not approved",
    },
  });

  console.log("✅ Seeding completed.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
