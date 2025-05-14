"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ApplyFormDialog } from "./ApplyFormDialog";
import CandidateMetrics from "./CandidateMetrics";

interface Application {
  id: string;
  resumeLink: string;
  coverLetter?: string;
  status: string;
  createdAt: string;
  recruiterNotes?: string;
  reviewedAt?: string;
  candidate?: {
    name: string;
    email: string;
  };
  job: {
    jobTitle: string;
    department: string;
    location: string;
  };
}

interface Job {
  id: string;
  jobTitle: string;
  department: string;
  location: string;
  createdAt: string;
}

const CandidateDashboard = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      try {
        const res = await axios.get("/api/auth/session");
        setUserRole(res.data.user.role);
      } catch {
        toast.error("Failed to fetch user session");
      }
    };

    getSession();
  }, []);

  useEffect(() => {
    if (!userRole) return;

    const fetchData = async () => {
      try {
        if (userRole === "CANDIDATE") {
          const [jobRes, appRes] = await Promise.all([
            axios.get("/api/jobs/available"),
            axios.get("/api/applications/my"),
          ]);
          setJobs(jobRes.data);
          setApplications(appRes.data);
        } else if (userRole === "ADMIN") {
          const res = await axios.get("/api/applications/all");
          setApplications(res.data);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load data");
      } finally {
        setIsLoading(false);
        setAppLoading(false);
      }
    };

    fetchData();
  }, [userRole]);

  return (
    <div className="w-full max-w-screen overflow-x-hidden">
      <div className="px-4 py-4">
        <Card>
          <CardContent>
            <CandidateMetrics />
          </CardContent>
        </Card>
      </div>

      {/* Candidate-only job table */}
      {userRole === "CANDIDATE" && (
        <div className="px-4 pb-6 space-y-2">
          <h2 className="text-xl font-semibold">Available Job Postings</h2>
          <div className="overflow-x-auto rounded-lg border max-w-full">
            <table className="min-w-full table-auto text-sm">
              <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">Title</th>
                  <th className="px-6 py-3 text-left font-semibold">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left font-semibold">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left font-semibold">Apply</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  [...Array(3)].map((_, i) => (
                    <tr key={i} className="border-t">
                      {[...Array(4)].map((_, j) => (
                        <td key={j} className="px-6 py-4">
                          <Skeleton className="h-4 w-24" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : jobs.length > 0 ? (
                  jobs.map((job) => {
                    const alreadyApplied = applications.some(
                      (app) =>
                        app.job.jobTitle === job.jobTitle &&
                        app.job.department === job.department &&
                        app.job.location === job.location
                    );
                    return (
                      <tr key={job.id} className="border-t bg-white">
                        <td className="px-6 py-4 font-medium">
                          {job.jobTitle}
                        </td>
                        <td className="px-6 py-4">{job.department}</td>
                        <td className="px-6 py-4">{job.location}</td>
                        <td className="px-6 py-4">
                          {alreadyApplied ? (
                            <span className="text-sm text-muted-foreground">
                              Applied
                            </span>
                          ) : (
                            <ApplyFormDialog jobId={job.id} />
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-6 text-center text-muted-foreground"
                    >
                      No jobs available at the moment.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Applications Table (for both candidate and admin) */}
      <div className="px-4 pb-10 space-y-2">
        <h2 className="text-xl font-semibold">
          {userRole === "ADMIN" ? "All Applications" : "My Applications"}
        </h2>
        <div className="overflow-x-auto rounded-lg border max-w-full">
          <table className="min-w-full table-auto text-sm">
            <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
              <tr>
                {userRole === "ADMIN" && (
                  <>
                    <th className="px-6 py-3 text-left font-semibold">
                      Candidate
                    </th>
                    <th className="px-6 py-3 text-left font-semibold">Email</th>
                  </>
                )}
                <th className="px-6 py-3 text-left font-semibold">Job Title</th>
                <th className="px-6 py-3 text-left font-semibold">
                  Department
                </th>
                <th className="px-6 py-3 text-left font-semibold">Location</th>
                <th className="px-6 py-3 text-left font-semibold">Status</th>
                <th className="px-6 py-3 text-left font-semibold">
                  Applied On
                </th>
                <th className="px-6 py-3 text-left font-semibold">Resume</th>
                <th className="px-6 py-3 text-left font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody>
              {appLoading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i} className="border-t">
                    {[...Array(userRole === "ADMIN" ? 8 : 7)].map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <Skeleton className="h-4 w-24" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : applications.length > 0 ? (
                applications.map((app) => (
                  <tr key={app.id} className="border-t bg-white">
                    {userRole === "ADMIN" && (
                      <>
                        <td className="px-6 py-4">
                          {app.candidate?.name || "—"}
                        </td>
                        <td className="px-6 py-4">
                          {app.candidate?.email || "—"}
                        </td>
                      </>
                    )}
                    <td className="px-6 py-4">{app.job.jobTitle}</td>
                    <td className="px-6 py-4">{app.job.department}</td>
                    <td className="px-6 py-4">{app.job.location}</td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          app.status === "SHORTLISTED" ? "default" : "outline"
                        }
                        className={
                          app.status === "SHORTLISTED"
                            ? "bg-blue-500 text-white"
                            : ""
                        }
                      >
                        {app.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
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
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {app.recruiterNotes || "—"}
                      {app.reviewedAt && (
                        <div className="text-xs italic mt-1">
                          Reviewed:{" "}
                          {new Date(app.reviewedAt).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={userRole === "ADMIN" ? 8 : 7}
                    className="px-6 py-6 text-center text-muted-foreground"
                  >
                    {userRole === "ADMIN"
                      ? "No applications submitted yet."
                      : "You haven't applied to any jobs yet."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;
