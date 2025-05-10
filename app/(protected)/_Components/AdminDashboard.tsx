"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@prisma/client";
import axios from "axios";

const AdminDashboard = () => {
  const [unverifiedUsers, setUnverifiedUsers] = useState<User[]>([]);
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userRes = await axios.get("/api/users/unverified");
        setUnverifiedUsers(userRes.data);
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

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

  const renderSkeletonUser = () => (
    <div className="border rounded-xl p-4 flex justify-between items-center">
      <div className="space-y-1">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-64" />
      </div>
      <Skeleton className="h-8 w-20" />
    </div>
  );

  return (
    <Card className="w-full max-w-4xl mt-24 overflow-y-auto mb-1 mx-auto">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">
          Admin Approval Dashboard
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* <FormSuccess message="You are allowed to approve users." /> */}

        {/* Unverified Users Section */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Unverified Users</h2>

          {isLoading ? (
            <>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i}>{renderSkeletonUser()}</div>
              ))}
            </>
          ) : unverifiedUsers.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No users pending verification.
            </p>
          ) : (
            unverifiedUsers.map((user) => (
              <div
                key={user.id}
                className="border rounded-xl mb-2 p-4 flex justify-between items-center gap-3"
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

        {feedback && <p className="text-green-600 text-center">{feedback}</p>}
      </CardContent>
    </Card>
  );
};

export default AdminDashboard;
