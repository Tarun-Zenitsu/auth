"use client";

type ApplicationStatus = "PENDING" | "APPROVED" | "REJECTED" | string;

type Application = {
  id: string;
  candidateName: string;
  candidateEmail: string;
  status: ApplicationStatus;
};

import { useEffect, useState } from "react";
import { Requisition } from "@prisma/client";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Share2 } from "lucide-react";
import { NewJobForm } from "../_Components/NewJobForm";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ShareJobDialog } from "./ShareJobDialog";
import DashboardMetrics from "./DashboardMetrics";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const RecruiterDashboard = () => {
  const [open, setOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [selectedReqId, setSelectedReqId] = useState<string | null>(null);
  const [requisitions, setRequisitions] = useState<Requisition[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedApplications, setSelectedApplications] = useState<
    Application[]
  >([]);
  const [appModalOpen, setAppModalOpen] = useState(false);

  useEffect(() => {
    const fetchRequisitions = async () => {
      try {
        const res = await axios.get("/api/requisitions");
        setRequisitions(res.data);
      } catch (err) {
        console.error("Failed to load requisitions", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequisitions();
  }, []);

  const handleScreening = async (appId: string, status: string) => {
    try {
      await axios.patch(`/api/applications/${appId}/screen`, {
        status,
        notes: `Marked as ${status} by recruiter`,
      });

      setSelectedApplications((prev: Application[]) =>
        prev.map((app) => (app.id === appId ? { ...app, status } : app))
      );
    } catch (err) {
      console.error("Failed to update application status", err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <Badge className="bg-green-500 text-white">Approved</Badge>;
      case "REJECTED":
        return <Badge className="bg-red-500 text-white">Rejected</Badge>;
      case "PENDING":
        return <Badge className="bg-yellow-500 text-white">Pending</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white">{status}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6 bg-white  mx-auto w-full h-full flex flex-col">
      {/* Header and Create Button */}
      <div className="flex justify-between items-center sticky top-0 bg-white z-10 pb-2 border-b">
        <h1 className="text-3xl font-bold">Recruiter Dashboard</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" /> Create New Job
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a New Job Posting</DialogTitle>
            </DialogHeader>
            <NewJobForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Metrics */}
      <Card>
        <CardContent>
          <DashboardMetrics />
        </CardContent>
      </Card>

      {/* Requisitions Table */}
      <div className="flex-1 overflow-y-auto rounded-lg border">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Job Title</th>
              <th className="px-6 py-3 text-left font-semibold">Department</th>
              <th className="px-6 py-3 text-left font-semibold">Location</th>
              <th className="px-6 py-3 text-left font-semibold">Status</th>
              <th className="px-6 py-3 text-left font-semibold">Actions</th>
              <th className="px-6 py-3 text-left font-semibold">
                Applications
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <tr key={idx} className="border-t">
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-32" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-24" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-20" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-16" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-12" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-20" />
                  </td>
                </tr>
              ))
            ) : requisitions.length > 0 ? (
              requisitions.map((req) => (
                <tr key={req.id} className="border-t bg-white">
                  <td className="px-6 py-4 font-medium">{req.jobTitle}</td>
                  <td className="px-6 py-4">{req.department}</td>
                  <td className="px-6 py-4">{req.location}</td>
                  <td className="px-6 py-4">{getStatusBadge(req.status)}</td>
                  <td className="px-6 py-4">
                    {req.status === "APPROVED" && !req.posted ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedReqId(req.id);
                          setShareOpen(true);
                        }}
                      >
                        <Share2 className="w-4 h-4 mr-2" /> Share
                      </Button>
                    ) : (
                      req.posted && (
                        <Badge className="bg-blue-500 text-white">Posted</Badge>
                      )
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/recruiter/applications/${req.id}`}
                      className="text-blue-600 underline text-sm"
                    >
                      View Applications
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-6 text-center text-muted-foreground"
                >
                  No requisitions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Share Job Dialog */}
      <ShareJobDialog
        requisitionId={selectedReqId}
        open={shareOpen}
        onClose={() => {
          setShareOpen(false);
          setSelectedReqId(null);
        }}
        onSuccess={() => {
          setRequisitions((prev) =>
            prev.map((req) =>
              req.id === selectedReqId ? { ...req, posted: true } : req
            )
          );
        }}
      />

      {/* Applications Modal */}
      <Dialog open={appModalOpen} onOpenChange={setAppModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Applications</DialogTitle>
            <DialogDescription>
              Review and screen candidate applications.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {selectedApplications.length === 0 ? (
              <p className="text-muted-foreground">No applications yet.</p>
            ) : (
              selectedApplications.map((app) => (
                <div key={app.id} className="border p-4 rounded-md space-y-2">
                  <p>
                    <span className="font-medium">Candidate:</span>{" "}
                    {app.candidateName}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    {app.candidateEmail}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>{" "}
                    {getStatusBadge(app.status)}
                  </p>
                  <div className="space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleScreening(app.id, "APPROVED")}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleScreening(app.id, "REJECTED")}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RecruiterDashboard;
