"use client";

import { useEffect, useState } from "react";
import { Requisition } from "@prisma/client";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";

interface RequisitionWithCreator extends Requisition {
  createdBy: {
    name: string;
    email: string;
  };
}

export default function JobApproval() {
  const [requisitions, setRequisitions] = useState<RequisitionWithCreator[]>(
    []
  );
  const [rejectionReasons, setRejectionReasons] = useState<
    Record<string, string>
  >({});
  const [showRejectInput, setShowRejectInput] = useState<
    Record<string, boolean>
  >({});
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/requisitions/pending").then((res) => {
      setRequisitions(res.data);
      setIsLoading(false);
    });
  }, []);

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
    } catch (err) {
      setFeedback("Error processing decision.");
      console.error(err);
    }
  };

  const renderSkeleton = () => (
    <div className="border rounded-xl p-4 space-y-2">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-1/4" />
      <div className="flex gap-2 mt-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  );

  return (
    <div className="bg-white p-3 w-4xl max-w-5xl mx-auto rounded-md shadow-md">
      <h2 className="text-xl font-semibold mb-4 sticky top-0 bg-white z-10">
        Pending Job Requisitions
      </h2>

      <div className="space-y-4 overflow-y-auto max-h-[70vh] pr-2">
        {isLoading ? (
          <>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i}>{renderSkeleton()}</div>
            ))}
          </>
        ) : requisitions.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No pending requisitions.
          </p>
        ) : (
          requisitions.map((req) => (
            <div
              key={req.id}
              className="border rounded-xl p-4 space-y-2 hover:shadow-sm transition"
            >
              <p className="font-semibold">{req.jobTitle}</p>
              <p className="text-sm text-muted-foreground">
                Department: {req.department} | Location: {req.location}
              </p>
              <p className="text-sm">Created by: {req.createdBy.name}</p>

              {showRejectInput[req.id] && (
                <Textarea
                  placeholder="Enter rejection reason"
                  value={rejectionReasons[req.id] || ""}
                  onChange={(e) =>
                    setRejectionReasons({
                      ...rejectionReasons,
                      [req.id]: e.target.value,
                    })
                  }
                />
              )}

              <div className="flex gap-2">
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => handleDecision(req.id, "APPROVED")}
                >
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  onClick={() =>
                    setShowRejectInput((prev) => ({
                      ...prev,
                      [req.id]: !prev[req.id],
                    }))
                  }
                >
                  {showRejectInput[req.id] ? "Cancel" : "Reject"}
                </Button>
                {showRejectInput[req.id] && (
                  <Button
                    variant="secondary"
                    onClick={() => handleDecision(req.id, "REJECTED")}
                  >
                    Submit Rejection
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {feedback && <p className="text-green-600 mt-4">{feedback}</p>}
    </div>
  );
}
