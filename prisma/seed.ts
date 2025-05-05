import {
  PrismaClient,
  UserRole,
  ApplicationStatus,
  InterviewMode,
  DocumentType,
} from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Create Users
  const users = await prisma.$transaction([
    prisma.user.create({
      data: {
        name: "Admin Alice",
        email: "admin@company.com",
        password: "admin123",
        role: UserRole.ADMIN,
      },
    }),
    prisma.user.create({
      data: {
        name: "Auditor Alan",
        email: "auditor@company.com",
        password: "auditor123",
        role: UserRole.AUDITOR,
      },
    }),
    prisma.user.create({
      data: {
        name: "Recruiter Rachel",
        email: "recruiter@company.com",
        password: "recruiter123",
        role: UserRole.RECRUITER,
      },
    }),
    prisma.user.create({
      data: {
        name: "HR Henry",
        email: "hr@company.com",
        password: "hr123",
        role: UserRole.HR,
      },
    }),
    prisma.user.create({
      data: {
        name: "Candidate Carol",
        email: "carol@jobseeker.com",
        password: "candidate123",
        role: UserRole.CANDIDATE,
      },
    }),
    prisma.user.create({
      data: {
        name: "Candidate Chris",
        email: "chris@jobseeker.com",
        password: "candidate123",
        role: UserRole.CANDIDATE,
      },
    }),
  ]);

  const recruiter = users.find((u) => u.role === UserRole.RECRUITER)!;
  const candidates = users.filter((u) => u.role === UserRole.CANDIDATE)!;

  // Create Jobs
  const jobs = await prisma.$transaction([
    prisma.job.create({
      data: {
        title: "Backend Developer",
        description: "Build APIs and manage database systems.",
        department: "Engineering",
        location: "Remote",
        openings: 3,
      },
    }),
    prisma.job.create({
      data: {
        title: "UI/UX Designer",
        description: "Design user interfaces and experiences.",
        department: "Design",
        location: "On-site",
        openings: 2,
      },
    }),
  ]);

  // Create Applications
  const applications = await Promise.all(
    candidates.flatMap((candidate) =>
      jobs.map((job) =>
        prisma.application.create({
          data: {
            candidateId: candidate.id,
            jobId: job.id,
            status: ApplicationStatus.SCREENING,
            resumeUrl: "https://example.com/resume.pdf",
            coverLetter: `Hi, I am applying for ${job.title}`,
          },
        })
      )
    )
  );

  // Create Interviews & Feedbacks
  for (const application of applications) {
    const interview = await prisma.interview.create({
      data: {
        applicationId: application.id,
        interviewerId: recruiter.id,
        round: 1,
        scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days later
        mode: InterviewMode.ONLINE,
        notes: "Initial HR screening",
      },
    });

    await prisma.feedback.create({
      data: {
        interviewId: interview.id,
        applicationId: application.id,
        reviewerId: recruiter.id,
        rating: Math.floor(Math.random() * 5) + 1,
        comments: "Decent performance, room for growth.",
      },
    });
  }

  // Add Documents
  await Promise.all(
    applications.map((app) =>
      prisma.document.create({
        data: {
          applicationId: app.id,
          type: DocumentType.RESUME,
          url: "https://example.com/docs/resume.pdf",
        },
      })
    )
  );

  // Notifications
  await Promise.all(
    candidates.map((c) =>
      prisma.notification.create({
        data: {
          userId: c.id,
          message: "Your application has been received and is under review.",
        },
      })
    )
  );

  console.log("🚀 Seeded realistic data successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
