"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ApplicationStatus } from "@prisma/client";

interface AssignedApplication {
  id: string;
  status: ApplicationStatus;
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

export default function TechnicalDashboard() {
  const [applications, setApplications] = useState<AssignedApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch("/api/technical/assigned-applications");
        if (!res.ok) throw new Error("Failed to load assigned applications");
        const data = await res.json();
        setApplications(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div className="h-full w-full flex justify-center items-start">
      <Card className="w-full h-full flex flex-col">
        <CardHeader className="sticky top-0 bg-white z-10 border-b shadow-sm">
          <h1 className="text-3xl font-bold text-center">
            Technical Dashboard
          </h1>
          <p className="text-center text-muted-foreground text-sm mt-1">
            Review and manage applications assigned to you.
          </p>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {loading ? (
            [...Array(3)].map((_, idx) => (
              <Skeleton key={idx} className="h-32 w-full rounded-xl" />
            ))
          ) : applications.length === 0 ? (
            <p className="text-muted-foreground text-center">
              No applications assigned to you.
            </p>
          ) : (
            applications.map((app) => (
              <div
                key={app.id}
                className="border p-4 rounded-md shadow-sm space-y-2 bg-muted"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {app.candidate.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {app.candidate.email}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      <span className="font-medium">Applied for:</span>{" "}
                      {app.job.jobTitle} – {app.job.department},{" "}
                      {app.job.location}
                    </p>
                  </div>
                  <Badge variant="outline">{app.status}</Badge>
                </div>
                <div className="pt-2 space-x-4 text-sm">
                  <a
                    href={app.resumeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 font-medium underline"
                  >
                    View Resume
                  </a>
                  {app.coverLetter && (
                    <a
                      href={app.coverLetter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 font-medium underline"
                    >
                      View Cover Letter
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
