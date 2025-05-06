"use client";

import { useEffect, useState } from "react";
import RoleGate from "@/components/auth/role-gate";
import { FormSuccess } from "@/components/form-success";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UserRole, Requisition, User } from "@prisma/client";
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
  const [unverifiedUsers, setUnverifiedUsers] = useState<User[]>([]);
  const [rejectionReasons, setRejectionReasons] = useState<
    Record<string, string>
  >({});
  const [showRejectInput, setShowRejectInput] = useState<
    Record<string, boolean>
  >({});
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const [reqRes, userRes] = await Promise.all([
        axios.get("/api/requisitions/pending"),
        axios.get("/api/users/unverified"),
      ]);
      setRequisitions(reqRes.data);
      setUnverifiedUsers(userRes.data);
    };
    fetchData();
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

  const handleUserApproval = async (userId: string) => {
    try {
      await axios.patch(`/api/users/${userId}/verify`);
      setFeedback("User approved successfully.");
      setUnverifiedUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      setFeedback("Error verifying user.");
      console.error(err);
    }
  };

  return (
    <Card className="w-full max-w-4xl mt-25 overflow-y-auto mb-1">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">
          Admin Approval Dashboard
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        <RoleGate allowedRoles={[UserRole.ADMIN]}>
          <FormSuccess message="You are allowed to approve/reject requisitions and users." />

          {/* Unverified Users Section */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Unverified Users</h2>
            {unverifiedUsers.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No users pending verification.
              </p>
            ) : (
              unverifiedUsers.map((user) => (
                <div
                  key={user.id}
                  className="border rounded-xl p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {user.email} — Role: {user.role}
                    </p>
                  </div>
                  <Button onClick={() => handleUserApproval(user.id)}>
                    Verify
                  </Button>
                </div>
              ))
            )}
          </div>

          {/* Requisitions Section */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Pending Requisitions</h2>
            {requisitions.length === 0 ? (
              <p className="text-muted-foreground text-sm">
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
          </div>

          {feedback && <p className="text-green-600 text-center">{feedback}</p>}
        </RoleGate>
      </CardContent>
    </Card>
  );
};

export default Page;
