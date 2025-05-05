"use client";

import { useEffect, useState } from "react";
import RoleGate from "@/components/auth/role-gate";
import { FormSuccess } from "@/components/form-success";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UserRole, Requisition } from "@prisma/client";
import axios from "axios";

interface RequisitionWithCreator extends Requisition {
  createdBy: {
    name: string;
    email: string;
  };
}

const Page = () => {
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

  useEffect(() => {
    const fetchRequisitions = async () => {
      const res = await axios.get("/api/requisitions/pending");
      setRequisitions(res.data);
    };
    fetchRequisitions();
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
      console.log(err);
    }
  };

  return (
    <Card className="w-full max-w-4xl mt-25 overflow-y-auto mb-1">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">
          Pending Requisitions
        </p>
      </CardHeader>
      <CardContent className="space-y-2">
        <RoleGate allowedRoles={[UserRole.ADMIN]}>
          <FormSuccess message="You are allowed to approve/reject requisitions." />
          {requisitions.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No pending requisitions.
            </p>
          ) : (
            requisitions.map((req) => (
              <div key={req.id} className="border rounded-xl p-4 space-y-1">
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
                    variant="default"
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
          {feedback && <p className="text-green-600 text-center">{feedback}</p>}
        </RoleGate>
      </CardContent>
    </Card>
  );
};

export default Page;
