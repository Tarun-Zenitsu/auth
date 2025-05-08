"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { ApplyFormDialog } from "./ApplyFormDialog";

interface Job {
  id: string;
  jobTitle: string;
  department: string;
  location: string;
  createdAt: string;
}

interface Application {
  id: string;
  resumeLink: string;
  coverLetter?: string;
  status: string;
  createdAt: string;
  recruiterNotes?: string;
  reviewedAt?: string;
  job: {
    jobTitle: string;
    department: string;
    location: string;
  };
}

const CandidateDashboard = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get("/api/jobs/available");
        setJobs(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load jobs");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchApplications = async () => {
      try {
        const res = await axios.get("/api/applications/my");
        setApplications(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load applications");
      } finally {
        setAppLoading(false);
      }
    };

    fetchJobs();
    fetchApplications();
  }, []);

  return (
    <div className="h-[calc(100vh-110px)] w-full flex justify-center items-start mt-27">
      {/* Subtract navbar height (64px) from 100vh */}
      <Card className="w-full max-w-5xl h-full flex flex-col border shadow-md">
        {/* Fixed Header */}
        <CardHeader className="sticky top-0 bg-white z-10 border-b shadow-sm">
          <h1 className="text-3xl font-bold text-center">
            Candidate Dashboard
          </h1>
          <p className="text-center text-muted-foreground text-sm mt-1">
            View and apply to job postings, and track your application status.
          </p>
        </CardHeader>

        {/* Scrollable Content */}
        <CardContent className="flex-1 overflow-y-auto px-6 py-4 space-y-10">
          {/* Jobs Section */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Available Job Postings</h2>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="border p-4 rounded-md">
                    <Skeleton className="h-5 w-40 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              </div>
            ) : jobs.length > 0 ? (
              jobs.map((job) => (
                <div
                  key={job.id}
                  className="p-4 border rounded-md shadow-sm space-y-1 bg-muted"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{job.jobTitle}</h3>
                      <p className="text-sm text-muted-foreground">
                        {job.department} – {job.location}
                      </p>
                    </div>
                    <Badge className="bg-blue-500 text-white">Open</Badge>
                  </div>
                  <div className="pt-2">
                    <ApplyFormDialog jobId={job.id} />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">
                No jobs available at the moment.
              </p>
            )}
          </section>

          {/* Applications Section */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">My Applications</h2>
            {appLoading ? (
              <div className="space-y-3">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="border p-4 rounded-md">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                ))}
              </div>
            ) : applications.length > 0 ? (
              applications.map((app) => (
                <div
                  key={app.id}
                  className="border p-4 rounded-md shadow-sm space-y-2 bg-muted"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-lg">
                        {app.job.jobTitle}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {app.job.department} – {app.job.location}
                      </p>
                    </div>
                    <Badge variant="outline">{app.status}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Applied on: {new Date(app.createdAt).toLocaleDateString()}
                  </div>
                  <div>
                    <a
                      href={app.resumeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-sm underline"
                    >
                      View Resume
                    </a>
                  </div>
                  {app.coverLetter && (
                    <p className="italic text-sm">{app.coverLetter}</p>
                  )}
                  {app.recruiterNotes && (
                    <p className="text-sm text-muted-foreground">
                      <strong>Recruiter Notes:</strong> {app.recruiterNotes}
                    </p>
                  )}
                  {app.reviewedAt && (
                    <p className="text-xs text-muted-foreground italic">
                      Reviewed on:{" "}
                      {new Date(app.reviewedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">
                You haven&apos;t applied to any jobs yet.
              </p>
            )}
          </section>
        </CardContent>
      </Card>
    </div>
  );
};

export default CandidateDashboard;
