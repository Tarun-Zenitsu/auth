"use client";

import { useEffect, useState } from "react";
import { Requisition } from "@prisma/client";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Share2 } from "lucide-react";
import { NewJobForm } from "../_Components/NewJobForm";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ShareJobDialog } from "./ShareJobDialog";
import Link from "next/link";
import DashboardMetrics from "./DashboardMetrics";
import { Card, CardContent } from "@/components/ui/card";

const RecruiterDashboard = () => {
  const [open, setOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [selectedReqId, setSelectedReqId] = useState<string | null>(null);
  const [requisitions, setRequisitions] = useState<Requisition[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <Badge className="bg-green-500 hover:bg-green-600 text-white">
            Approved
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className="bg-red-500 hover:bg-red-600 text-white">
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
            Pending
          </Badge>
        );
    }
  };

  return (
    <div className="p-6 space-y-6 mt-10 bg-white rounded-xl shadow-md max-w-6xl mx-auto w-full h-[82vh] flex flex-col mb-0">
      <div className="flex justify-between items-center sticky top-0 bg-white z-10 pb-2 border-b">
        <h1 className="text-3xl font-bold">Recruiter Dashboard</h1>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create New Job
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

      {/* Dashboard Metrics inside a Card */}
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
              requisitions.map((req, index) => (
                <tr
                  key={req.id}
                  className={`border-t ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-6 py-4 font-medium">{req.jobTitle}</td>
                  <td className="px-6 py-4">{req.department}</td>
                  <td className="px-6 py-4">{req.location}</td>
                  <td className="px-6 py-4">{getStatusBadge(req.status)}</td>
                  <td className="px-6 py-4">
                    {req.status === "APPROVED" && !req.posted && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedReqId(req.id);
                          setShareOpen(true);
                        }}
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    )}
                    {req.posted && (
                      <Badge className="bg-blue-500 text-white">Posted</Badge>
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
    </div>
  );
};

export default RecruiterDashboard;
