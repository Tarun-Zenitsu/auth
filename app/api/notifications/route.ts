import { auth } from "@/auth";
import prisma from "@/lib/db";

type NotificationItem = {
  type: string;
  message: string;
  createdAt?: string;
};

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const userId = session.user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  let notifications: NotificationItem[] = [];

  switch (user?.role) {
    case "ADMIN": {
      const pending = await prisma.requisition.findMany({
        where: { status: "PENDING_APPROVAL" },
        select: { jobTitle: true, department: true, createdAt: true },
      });

      notifications = pending.map((req) => ({
        type: "REQUISITION_PENDING",
        message: `Requisition for ${req.jobTitle} (${req.department}) is pending approval.`,
        createdAt: req.createdAt.toISOString(),
      }));
      break;
    }

    case "TECHNICAL_TEAM": {
      const assigned = await prisma.application.findMany({
        where: {
          assignedToTechId: userId,
          reviews: { none: {} },
        },
        include: {
          candidate: { select: { name: true } },
          job: { select: { jobTitle: true } },
        },
      });

      notifications = assigned.map((app) => ({
        type: "REVIEW_ASSIGNMENT",
        message: `Review ${app.candidate.name}'s application for ${app.job.jobTitle}`,
      }));
      break;
    }

    case "RECRUITER": {
      const submitted = await prisma.application.findMany({
        where: {
          reviewedById: userId,
          reviewedAt: null,
        },
        include: {
          candidate: { select: { name: true } },
          job: { select: { jobTitle: true } },
        },
      });

      notifications = submitted.map((app) => ({
        type: "CANDIDATE_SUBMITTED",
        message: `${app.candidate.name} applied for ${app.job.jobTitle}. Awaiting your review.`,
      }));
      break;
    }

    case "HIRING_MANAGER": {
      const feedback = await prisma.requisition.findMany({
        where: {
          createdById: userId,
          status: {
            in: ["APPROVED", "REJECTED"],
          },
        },
        select: {
          jobTitle: true,
          status: true,
          updatedAt: true,
        },
      });

      notifications = feedback.map((req) => ({
        type: "REQUISITION_STATUS",
        message: `Your requisition for ${
          req.jobTitle
        } was ${req.status.toLowerCase()}.`,
        createdAt: req.updatedAt.toISOString(),
      }));
      break;
    }

    case "CANDIDATE": {
      const updates = await prisma.application.findMany({
        where: {
          candidateId: userId,
          status: {
            in: ["SHORTLISTED", "REJECTED", "INTERVIEW_STAGE", "HOLD"],
          },
        },
        include: {
          job: { select: { jobTitle: true } },
        },
      });

      notifications = updates.map((app) => ({
        type: "APPLICATION_STATUS",
        message: `Your application for ${app.job.jobTitle} was ${app.status
          .toLowerCase()
          .replace(/_/g, " ")}.`,
      }));
      break;
    }

    case "AUDITOR": {
      notifications.push({
        type: "AUDIT_ALERT",
        message: "No active audit alerts. You’re all caught up!",
      });
      break;
    }

    default:
      break;
  }

  return new Response(JSON.stringify(notifications), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
