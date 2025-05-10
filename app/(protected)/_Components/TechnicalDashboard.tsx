"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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

  if (loading) {
    return (
      <div className="p-6 grid gap-4">
        {[...Array(3)].map((_, idx) => (
          <Skeleton key={idx} className="h-32 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Assign Applications</h2>

      {applications.length === 0 ? (
        <p className="text-muted-foreground">
          No applications assigned to you.
        </p>
      ) : (
        <div className="grid gap-4">
          {applications.map((app) => (
            <Card key={app.id} className="shadow-md">
              <CardContent className="p-5 space-y-2">
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
                <div className="pt-2 space-x-4">
                  <a
                    href={app.resumeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    View Resume
                  </a>
                  {app.coverLetter && (
                    <a
                      href={app.coverLetter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-blue-600 hover:underline"
                    >
                      View Cover Letter
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
