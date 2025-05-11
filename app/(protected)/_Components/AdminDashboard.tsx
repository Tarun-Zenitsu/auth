"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@prisma/client";
import axios from "axios";
import AdminMetrics from "./AdminMetrics";

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
    <div className="border rounded-xl p-4 flex justify-between items-center mb-4">
      <div className="space-y-1">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-64" />
      </div>
      <Skeleton className="h-8 w-20" />
    </div>
  );

  return (
    <Card className="w-full bg-white shadow-sm">
      <CardContent className="p-2">
        {/* 🟢 Metrics Section */}
        <AdminMetrics />

        {/* 🔵 Unverified Users Table */}
        <div className="mt-4 ml-5">
          <h2 className="text-xl font-semibold mb-4">Unverified Users</h2>

          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i}>{renderSkeletonUser()}</div>
            ))
          ) : unverifiedUsers.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No users pending verification.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted-foreground border-b">
                  <th className="text-left py-2">Name</th>
                  <th className="text-left py-2">Role</th>
                  <th className="text-left py-2">Joined</th>
                  <th className="py-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {unverifiedUsers.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="py-2 font-medium">{user.name}</td>
                    <td className="py-2 capitalize">{user.role}</td>
                    <td className="py-2">
                      {new Date(user.createdAt).toDateString()}
                    </td>
                    <td className="py-2 text-center">
                      <Button
                        size="sm"
                        onClick={() => handleUserApproval(user.id)}
                        className="bg-blue-900 hover:bg-blue-800"
                      >
                        Verify
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {feedback && (
            <p className="text-green-600 text-center mt-4">{feedback}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminDashboard;
