// app/_Components/job-approval.tsx (Client Component)
"use client";

import { useEffect, useState } from "react";
import { Requisition } from "@prisma/client";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

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
  const [showRejectInput, setShowRejectInput] = useState<
    Record<string, boolean>
  >({});
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Client-side protection
  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/auth/login");
    }
    if (
      status === "authenticated" &&
      !["ADMIN", "HIRING_MANAGER"].includes(session.user.role)
    ) {
      redirect("/unauthorized");
    }
  }, [status, session]);

  // Data fetching
  useEffect(() => {
    if (status === "authenticated") {
      axios
        .get("/api/requisitions/pending")
        .then((res) => {
          setRequisitions(res.data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching requisitions:", error);
          setIsLoading(false);
        });
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
      setTimeout(() => setFeedback(""), 3000);
    } catch (err) {
      setFeedback("Error processing decision.");
      console.error(err);
      setTimeout(() => setFeedback(""), 3000);
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

  if (status === "loading") {
    return (
      <div className="bg-white p-3 w-4xl max-w-5xl mx-auto rounded-md shadow-md">
        <h2 className="text-xl font-semibold mb-4">Loading authorization...</h2>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i}>{renderSkeleton()}</div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-3 rounded-md shadow-md h-screen">
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
                  placeholder="Enter rejection reason (required)"
                  value={rejectionReasons[req.id] || ""}
                  onChange={(e) =>
                    setRejectionReasons({
                      ...rejectionReasons,
                      [req.id]: e.target.value,
                    })
                  }
                  required
                />
              )}

              <div className="flex gap-2 flex-wrap">
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
                    disabled={!rejectionReasons[req.id]?.trim()}
                  >
                    Submit Rejection
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {feedback && (
        <p
          className={`mt-4 ${
            feedback.includes("Error") ? "text-red-600" : "text-green-600"
          }`}
        >
          {feedback}
        </p>
      )}
    </div>
  );
}
