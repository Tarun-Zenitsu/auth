"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FormSuccess } from "@/components/form-success";
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

const CandidateDashboard = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get("/api/jobs/available");
        setJobs(res.data);
      } catch (err) {
        console.log(err);
        toast.error("Failed to load jobs");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <Card className="w-full max-w-4xl mx-auto mt-10">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">
          Candidate Dashboard
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormSuccess message="Welcome to your Candidate Dashboard!" />
        <div className="text-center text-muted-foreground">
          Here you’ll find your job applications, interview status, and
          messages.
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-medium">Available Job Postings</h2>
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
                className="p-4 border rounded-md shadow-sm space-y-1"
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
        </div>
      </CardContent>
    </Card>
  );
};

export default CandidateDashboard;
