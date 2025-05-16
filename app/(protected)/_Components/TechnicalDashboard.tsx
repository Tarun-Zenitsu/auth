"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import TechnicalDashboardMetrics from "./TechnicalDashboardMetrics";
import { useCurrentUser } from "@/hooks/use-current-user";
import { ApplicationStatus } from "@prisma/client";
import { ArrangeMeetingButton } from "./ArrangeMeetingButton";
import { GiveFeedbackButton } from "./GiveFeedbackButton";

interface AssignedApplication {
  id: string;
  status: ApplicationStatus;
  resumeLink: string;
  coverLetter?: string;
  candidate: { name: string; email: string };
  job: { jobTitle: string; department: string; location: string };
  updatedAt: string;
}

const getStatusBadge = (s: ApplicationStatus) => {
  switch (s) {
    case "SUBMITTED":
      return <Badge className="bg-green-500 text-white">Approved</Badge>;
    case "REJECTED":
      return <Badge className="bg-red-500 text-white">Rejected</Badge>;
    case "HOLD":
      return <Badge className="bg-yellow-500 text-white">Pending</Badge>;
    case "SHORTLISTED":
      return <Badge className="bg-blue-500 text-white">Shortlisted</Badge>;
    default:
      return (
        <Badge className="bg-gray-500 text-white capitalize">
          {s.toLowerCase()}
        </Badge>
      );
  }
};

export default function TechnicalDashboard() {
  const user = useCurrentUser();
  const [apps, setApps] = useState<AssignedApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const r = await fetch("/api/technical/assigned-applications");
        if (!r.ok) throw new Error("Failed to load assigned applications");
        setApps(await r.json());
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const deadline = (assignedAt: string) =>
    new Date(new Date(assignedAt).getTime() + 2 * 24 * 60 * 60 * 1000);

  return (
    <div className="w-full max-w-screen overflow-x-auto">
      {/* Metrics */}
      <div className="px-4 py-4">
        <Card>
          <CardContent>
            <TechnicalDashboardMetrics />
          </CardContent>
        </Card>
      </div>

      {/* Applications */}
      <div className="px-4 pb-4">
        <div className="overflow-x-auto rounded-lg border max-w-full shadow-sm">
          <table className="min-w-full table-auto text-sm border-collapse">
            <thead className="bg-muted sticky top-0 z-10 text-sm text-muted-foreground border-b">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Candidate</th>
                <th className="px-6 py-3 text-left font-semibold">Email</th>
                <th className="px-6 py-3 text-left font-semibold">Job Title</th>
                <th className="px-6 py-3 text-left font-semibold">
                  Department
                </th>
                <th className="px-6 py-3 text-left font-semibold">Location</th>
                <th className="px-6 py-3 text-left font-semibold">Status</th>
                <th className="px-6 py-3 text-left font-semibold">Deadline</th>
                <th className="px-6 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 3 }).map((_, row) => (
                  <tr key={row} className="border-t bg-white">
                    {Array.from({ length: 8 }).map((_, col) => (
                      <td key={col} className="px-6 py-4">
                        <Skeleton className="h-4 w-24" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : apps.length ? (
                apps.map((app) => {
                  const dl = deadline(app.updatedAt);
                  const overdue = dl < new Date();

                  return (
                    <tr
                      key={app.id}
                      className={`border-t transition-colors hover:bg-muted/40 ${
                        overdue
                          ? "bg-red-50"
                          : app.status === "SHORTLISTED"
                          ? "bg-blue-50"
                          : "bg-white"
                      }`}
                    >
                      <td className="px-6 py-4 font-medium">
                        {app.candidate.name}
                      </td>
                      <td className="px-6 py-4">{app.candidate.email}</td>
                      <td className="px-6 py-4">{app.job.jobTitle}</td>
                      <td className="px-6 py-4">{app.job.department}</td>
                      <td className="px-6 py-4">{app.job.location}</td>
                      <td className="px-6 py-4">
                        {getStatusBadge(app.status)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`font-medium ${
                            overdue ? "text-red-600" : "text-gray-700"
                          }`}
                        >
                          {dl.toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 space-y-1 flex flex-col">
                        <a
                          href={app.resumeLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          Resume
                        </a>
                        {app.coverLetter && (
                          <a
                            href={app.coverLetter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            Cover Letter
                          </a>
                        )}
                        <ArrangeMeetingButton applicationId={app.id} />
                        <GiveFeedbackButton applicationId={app.id} />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-6 text-center text-muted-foreground"
                  >
                    You currently have no applications assigned. 🎉
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
