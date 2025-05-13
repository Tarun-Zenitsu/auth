"use client";

import { useEffect, useState } from "react";
import { Requisition, RequisitionStatus } from "@prisma/client";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import HiringManagerMetrics from "./HiringManagerMetics";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RequisitionWithCreator extends Requisition {
  createdBy: {
    name: string;
    email: string;
  };
}

export default function JobApproval() {
  const { data: session, status } = useSession();
  const [requisitions, setRequisitions] = useState<RequisitionWithCreator[]>(
    []
  );
  const [rejectionReasons, setRejectionReasons] = useState<
    Record<string, string>
  >({});
  const [activeRejectId, setActiveRejectId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showApprovedOnly, setShowApprovedOnly] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") redirect("/auth/login");
    if (
      status === "authenticated" &&
      !["ADMIN", "HIRING_MANAGER"].includes(session.user.role)
    ) {
      redirect("/unauthorized");
    }
  }, [status, session]);

  useEffect(() => {
    if (status === "authenticated") {
      axios
        .get("/api/requisitions")
        .then((res) => setRequisitions(res.data))
        .catch((err) => console.error("Failed to fetch requisitions", err))
        .finally(() => setIsLoading(false));
    }
  }, [status]);

  const handleDecision = async (
    id: string,
    decision: "APPROVED" | "REJECTED"
  ) => {
    try {
      await axios.patch(`/api/requisitions/${id}/decision`, {
        status: decision,
        rejectionReason:
          decision === "REJECTED" ? rejectionReasons[id] : undefined,
      });
      setFeedback(`Requisition ${decision.toLowerCase()} successfully.`);
      setRequisitions((prev) => prev.filter((r) => r.id !== id));
      setActiveRejectId(null);
    } catch (err) {
      setFeedback("Error processing decision.");
      console.error(err);
    }
  };

  const filteredRequisitions = showApprovedOnly
    ? requisitions.filter((r) => r.status === "APPROVED")
    : requisitions;

  return (
    <div className="space-y-1">
      {/* Metrics */}
      <Card className="bg-white shadow-sm">
        <CardContent className="p-1">
          <HiringManagerMetrics />
        </CardContent>
      </Card>

      {/* Requisition Table */}
      <Card className="bg-white shadow-sm">
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">All Job Requisitions</h2>
            <Button
              variant="outline"
              onClick={() => setShowApprovedOnly(!showApprovedOnly)}
            >
              {showApprovedOnly ? "Show All" : "Show Approved Only"}
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full rounded-lg" />
              ))}
            </div>
          ) : filteredRequisitions.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No requisitions found.
            </p>
          ) : (
            <div className="overflow-auto">
              <table className="min-w-full border text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-4 py-2 text-left">Job Title</th>
                    <th className="border px-4 py-2 text-left">Department</th>
                    <th className="border px-4 py-2 text-left">Location</th>
                    <th className="border px-4 py-2 text-left">Salary</th>
                    <th className="border px-4 py-2 text-left">Created By</th>
                    <th className="border px-4 py-2 text-left">Status</th>
                    <th className="border px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequisitions.map((req) => (
                    <tr key={req.id} className="hover:bg-gray-50">
                      <td className="border px-4 py-2">{req.jobTitle}</td>
                      <td className="border px-4 py-2">{req.department}</td>
                      <td className="border px-4 py-2">{req.location}</td>
                      <td className="border px-4 py-2">
                        {req.salaryRange || "Not specified"}
                      </td>
                      <td className="border px-4 py-2">{req.createdBy.name}</td>
                      <td className="border px-4 py-2">
                        <span
                          className={
                            req.status === "APPROVED"
                              ? "text-green-600"
                              : req.status === "REJECTED"
                              ? "text-red-600"
                              : "text-yellow-600"
                          }
                        >
                          {req.status === "APPROVED"
                            ? "Approved"
                            : req.status === "REJECTED"
                            ? "Rejected"
                            : "Pending"}
                        </span>
                      </td>
                      <td className="border px-4 py-2">
                        {req.status === RequisitionStatus.PENDING_APPROVAL && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => handleDecision(req.id, "APPROVED")}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => setActiveRejectId(req.id)}
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {feedback && (
            <p
              className={`mt-6 text-center text-sm ${
                feedback.includes("Error") ? "text-red-600" : "text-green-600"
              }`}
            >
              {feedback}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Rejection Reason Modal */}
      <Dialog
        open={!!activeRejectId}
        onOpenChange={() => setActiveRejectId(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rejection Reason</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Provide a reason for rejection..."
            value={rejectionReasons[activeRejectId ?? ""] || ""}
            onChange={(e) =>
              setRejectionReasons((prev) => ({
                ...prev,
                [activeRejectId ?? ""]: e.target.value,
              }))
            }
            className="mt-2"
          />
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setActiveRejectId(null)}>
              Cancel
            </Button>
            <Button
              onClick={() =>
                activeRejectId && handleDecision(activeRejectId, "REJECTED")
              }
              disabled={!rejectionReasons[activeRejectId ?? ""]?.trim()}
              variant="destructive"
            >
              Submit Rejection
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
