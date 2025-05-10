import {
  PrismaClient,
  UserRole,
  RequisitionStatus,
  UrgencyLevel,
  ApplicationStatus,
  ReviewStatus,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Cleanup before seeding
  await prisma.technicalReview.deleteMany();
  await prisma.application.deleteMany();
  await prisma.requisition.deleteMany();
  await prisma.user.deleteMany();

  // Create Users with passwords
  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@example.com",
      password: "AdminPass123!",
      role: UserRole.ADMIN,
    },
  });

  const recruiter = await prisma.user.create({
    data: {
      name: "Recruiter User",
      email: "recruiter@example.com",
      password: "RecruiterPass123!",
      role: UserRole.RECRUITER,
    },
  });

  const hiringManager = await prisma.user.create({
    data: {
      name: "Hiring Manager",
      email: "manager@example.com",
      password: "ManagerPass123!",
      role: UserRole.HIRING_MANAGER,
    },
  });

  const techTeamUser = await prisma.user.create({
    data: {
      name: "Tech Interviewer",
      email: "tech@example.com",
      password: "TechPass123!",
      role: UserRole.TECHNICAL_TEAM,
    },
  });

  const candidate = await prisma.user.create({
    data: {
      name: "Candidate One",
      email: "candidate@example.com",
      password: "CandidatePass123!",
      role: UserRole.CANDIDATE,
    },
  });

  // Create Requisition
  const requisition = await prisma.requisition.create({
    data: {
      jobTitle: "Full Stack Developer",
      department: "Engineering",
      budgetCode: "ENG-2025-FS",
      justification: "Platform upgrade",
      openings: 1,
      skillTags: ["React", "Node.js", "PostgreSQL"],
      urgency: UrgencyLevel.HIGH,
      location: "Remote",
      salaryRange: "$100k - $120k",
      jobDescription: "We are hiring a full stack developer.",
      createdBy: { connect: { id: hiringManager.id } },
      approvedBy: { connect: { id: admin.id } },
      status: RequisitionStatus.APPROVED,
    },
  });

  // Create Application
  const application = await prisma.application.create({
    data: {
      candidateId: candidate.id,
      jobId: requisition.id,
      status: ApplicationStatus.SHORTLISTED,
      resumeLink: "https://example.com/resume.pdf",
      coverLetter: "I am very excited to apply...",
      reviewedById: recruiter.id,
      reviewedAt: new Date(),
      recruiterNotes: "Looks promising",
      assignedToTechId: techTeamUser.id,
    },
  });

  // Add Technical Review
  await prisma.technicalReview.create({
    data: {
      applicationId: application.id,
      reviewerId: techTeamUser.id,
      rating: 4,
      comments: "Strong understanding of backend",
      reviewedAt: new Date(),
      status: ReviewStatus.COMPLETED,
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
