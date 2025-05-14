import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Briefcase,
  MapPin,
  DollarSign,
  User,
  Tags,
  Timer,
  FileText,
  Users,
  ShieldCheck,
  XCircle,
  Globe,
  CalendarDays,
} from "lucide-react";

export default async function JobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const job = await prisma.requisition.findUnique({
    where: { id },
    include: {
      createdBy: true,
      approvedBy: true,
      applications: true,
    },
  });

  if (!job) return notFound();

  const statusColorMap: Record<string, string> = {
    APPROVED: "bg-green-500",
    REJECTED: "bg-red-500",
    PENDING_APPROVAL: "bg-yellow-500",
  };

  const statusBadge = (
    <Badge
      className={`${statusColorMap[job.status] || "bg-gray-500"} text-white`}
    >
      {job.status.replace("_", " ")}
    </Badge>
  );

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Job Overview</h1>
        <div className="space-x-2">
          <Link href={`/recruiter/applications/${job.id}`}>
            <Button variant="default">
              View Applications ({job.applications.length})
            </Button>
          </Link>
          <Link href="/recruiter">
            <Button variant="outline">← Back</Button>
          </Link>
        </div>
      </div>

      <Card className="shadow-lg rounded-2xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-semibold flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              {job.jobTitle}
            </CardTitle>
            {statusBadge}
          </div>
          <p className="text-muted-foreground text-sm flex items-center gap-2">
            <User className="w-4 h-4" />
            Created by: {job.createdBy?.name}
          </p>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
          <Field
            label="Department"
            value={job.department}
            icon={<ShieldCheck className="w-4 h-4" />}
          />
          <Field
            label="Location"
            value={job.location}
            icon={<MapPin className="w-4 h-4" />}
          />
          <Field
            label="Urgency"
            value={job.urgency}
            icon={<Timer className="w-4 h-4" />}
          />
          <Field
            label="Openings"
            value={String(job.openings)}
            icon={<Users className="w-4 h-4" />}
          />
          <Field
            label="Salary Range"
            value={job.salaryRange}
            icon={<DollarSign className="w-4 h-4" />}
          />
          <Field
            label="Budget Code"
            value={job.budgetCode}
            icon={<FileText className="w-4 h-4" />}
          />
          <Field
            label="Skill Tags"
            value={job.skillTags.join(", ")}
            icon={<Tags className="w-4 h-4" />}
          />
          <Field
            label="Justification"
            value={job.justification}
            icon={<FileText className="w-4 h-4" />}
          />

          {job.status === "APPROVED" && (
            <Field
              label="Approved By"
              value={job.approvedBy?.name || "—"}
              icon={<ShieldCheck className="w-4 h-4" />}
            />
          )}
          {job.status === "REJECTED" && (
            <Field
              label="Rejection Reason"
              value={job.rejectionReason || "—"}
              icon={<XCircle className="w-4 h-4" />}
            />
          )}

          <Field
            label="Posted"
            value={
              job.posted
                ? `Yes (on ${job.postedAt?.toLocaleDateString()})`
                : "No"
            }
            icon={<Globe className="w-4 h-4" />}
          />
          {job.posted && job.postChannels.length > 0 && (
            <Field
              label="Post Channels"
              value={job.postChannels.join(", ")}
              icon={<Globe className="w-4 h-4" />}
            />
          )}
          {job.expiresAt && (
            <Field
              label="Expires At"
              value={job.expiresAt.toLocaleDateString()}
              icon={<CalendarDays className="w-4 h-4" />}
            />
          )}

          <div className="md:col-span-2">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Job Description
            </p>
            <p className="whitespace-pre-line bg-muted p-3 rounded-md">
              {job.jobDescription}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <p className="text-muted-foreground font-medium flex items-center gap-1">
        {icon} {label}
      </p>
      <p className="text-base">{value || "—"}</p>
    </div>
  );
}
