"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"; // optional for recruiter notes
import { toast } from "sonner"; // optional for notifications

interface Application {
  id: string;
  resumeLink: string;
  coverLetter?: string;
  status: string;
  createdAt: string;
  recruiterNotes?: string;
  reviewedBy?: { name: string };
  reviewedAt?: string;
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

const ApplicationDetailsPage = () => {
  const { id } = useParams();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [noteMap, setNoteMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get(`/api/applications/${id}`);
        setApplications(res.data);
      } catch (err) {
        console.error("Failed to load applications", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchApplications();
  }, [id]);

  const handleNoteChange = (id: string, value: string) => {
    setNoteMap((prev) => ({ ...prev, [id]: value }));
  };

  const updateStatus = async (appId: string, newStatus: string) => {
    try {
      const notes = noteMap[appId] || "";
      const res = await axios.patch(`/api/applications/${appId}/screen`, {
        status: newStatus,
        notes,
      });
      setApplications((prev) =>
        prev.map((a) => (a.id === appId ? res.data : a))
      );
      toast.success(`Status updated to ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update status");
      console.error("Status update failed", err);
    }
  };

  return (
    <Card className="w-full max-w-6xl mx-auto mt-10">
      <CardHeader>
        <h1 className="text-2xl font-semibold text-center">
          Applications for Job #{id}
        </h1>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="space-y-2">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          ))
        ) : applications.length > 0 ? (
          applications.map((app) => (
            <div
              key={app.id}
              className="border p-4 rounded-md shadow-sm space-y-2"
            >
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div>
                  <h3 className="font-medium text-lg">
                    {app.candidate.name} ({app.candidate.email})
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Applied for: {app.job.jobTitle} – {app.job.department},{" "}
                    {app.job.location}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Submitted on: {new Date(app.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge>{app.status}</Badge>
              </div>

              <a
                href={app.resumeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline text-sm"
              >
                View Resume
              </a>

              {app.coverLetter && (
                <p className="italic text-sm text-muted-foreground">
                  {app.coverLetter}
                </p>
              )}

              <Textarea
                placeholder="Add optional notes..."
                value={noteMap[app.id] || ""}
                onChange={(e) => handleNoteChange(app.id, e.target.value)}
                className="text-sm"
              />

              <div className="flex gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateStatus(app.id, "SHORTLISTED")}
                >
                  Shortlist
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => updateStatus(app.id, "REJECTED")}
                >
                  Reject
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => updateStatus(app.id, "HOLD")}
                >
                  Hold
                </Button>
              </div>

              {app.reviewedBy && (
                <p className="text-xs text-muted-foreground italic">
                  Reviewed by: {app.reviewedBy?.name} on{" "}
                  {app.reviewedAt
                    ? new Date(app.reviewedAt).toLocaleDateString()
                    : "N/A"}
                </p>
              )}
            </div>
          ))
        ) : (
          <p className="text-muted-foreground text-center py-6">
            No applications found for this job.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ApplicationDetailsPage;
