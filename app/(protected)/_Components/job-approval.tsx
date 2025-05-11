"use client";

import { useEffect, useState } from "react";
import { Requisition } from "@prisma/client";
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
        .get("/api/requisitions/pending")
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

  return (
    <div className="space-y-4">
      <Card className="bg-white shadow-sm">
        <CardContent className="p-6">
          <HiringManagerMetrics />
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-6">
            Pending Job Requisitions
          </h2>

          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-lg" />
              ))}
            </div>
          ) : requisitions.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No pending requisitions.
            </p>
          ) : (
            <div className="grid gap-4">
              {requisitions.map((req) => (
                <Card key={req.id} className="border p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium">{req.jobTitle}</h3>
                      <p className="text-sm text-muted-foreground">
                        Department: {req.department}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Created By: {req.createdBy.name}
                      </p>
                    </div>
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
                  </div>
                </Card>
              ))}
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
