"use client";

import { useEffect, useState } from "react";
import { RequisitionStatus } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import TechnicalDashboardMetrics from "./TechnicalDashboardMetrics";
import { useCurrentUser } from "@/hooks/use-current-user";

interface AssignedApplication {
  id: string;
  status: RequisitionStatus;
  resumeLink: string;
  coverLetter?: string;
  candidate: {
    name: string;
    email: string;
  };
  job: {
    jobTitle: string;
    department: string;
    location: string;
  };
}

const getStatusBadge = (status: RequisitionStatus) => {
  switch (status) {
    case "APPROVED":
      return <Badge className="bg-green-500 text-white">Approved</Badge>;
    case "REJECTED":
      return <Badge className="bg-red-500 text-white">Rejected</Badge>;
    case "PENDING_APPROVAL":
      return <Badge className="bg-yellow-500 text-white">Pending</Badge>;
    default:
      return <Badge className="bg-gray-500 text-white">{status}</Badge>;
  }
};

export default function TechnicalDashboard() {
  const user = useCurrentUser();
  const [applications, setApplications] = useState<AssignedApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch("/api/technical/assigned-applications", {
          headers: {
            "X-User-Role": user?.role || "", // Send user role to backend
          },
        });
        if (!res.ok) throw new Error("Failed to load assigned applications");
        const data = await res.json();
        setApplications(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchApplications();
    }
  }, [user]);

  return (
    <div className="w-full max-w-screen overflow-x-hidden">
      {/* Header */}
      {/* Metrics */}
      <div className="px-4 py-4">
        <Card>
          <CardContent>
            <TechnicalDashboardMetrics />
          </CardContent>
        </Card>
      </div>

      {/* Applications Table */}
      <div className="px-4 pb-4">
        <div className="overflow-x-auto rounded-lg border max-w-full">
          <table className="min-w-full table-auto text-sm">
            <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Candidate</th>
                <th className="px-6 py-3 text-left font-semibold">Email</th>
                <th className="px-6 py-3 text-left font-semibold">Job Title</th>
                <th className="px-6 py-3 text-left font-semibold">
                  Department
                </th>
                <th className="px-6 py-3 text-left font-semibold">Location</th>
                <th className="px-6 py-3 text-left font-semibold">Status</th>
                <th className="px-6 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 3 }).map((_, idx) => (
                  <tr key={idx} className="border-t">
                    {Array.from({ length: 7 }).map((_, i) => (
                      <td key={i} className="px-6 py-4">
                        <Skeleton className="h-4 w-24" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : applications.length > 0 ? (
                applications.map((app) => (
                  <tr key={app.id} className="border-t bg-white">
                    <td className="px-6 py-4 font-medium">
                      {app.candidate.name}
                    </td>
                    <td className="px-6 py-4">{app.candidate.email}</td>
                    <td className="px-6 py-4">{app.job.jobTitle}</td>
                    <td className="px-6 py-4">{app.job.department}</td>
                    <td className="px-6 py-4">{app.job.location}</td>
                    <td className="px-6 py-4">{getStatusBadge(app.status)}</td>
                    <td className="px-6 py-4 space-x-2">
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
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-6 text-center text-muted-foreground"
                  >
                    No applications assigned to you.
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
