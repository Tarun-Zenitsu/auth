"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@prisma/client";
import axios from "axios";
import AdminMetrics from "./AdminMetrics";

const LIMIT = 10;

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get("/api/users/all", {
          params: { page, limit: LIMIT },
        });
        setUsers(res.data.users);
        setTotal(res.data.total);
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [page]);

  const handleUserApproval = async (userId: string) => {
    try {
      await axios.patch(`/api/users/${userId}/verify`);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isVerified: true } : u))
      );
      setFeedback("User verified successfully.");
    } catch (err) {
      setFeedback("Error verifying user.");
      console.error(err);
    }
  };

  const handleUserDeletion = async (userId: string) => {
    try {
      await axios.delete(`/api/users/${userId}/delete`);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setFeedback("User Revoke successfully.");
    } catch (err) {
      setFeedback("Error deleting user.");
      console.error(err);
    }
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <Card className="w-full bg-white shadow-sm">
      <CardContent className="p-2">
        <AdminMetrics />

        <div className="mt-4 ml-5">
          <h2 className="text-xl font-semibold mb-4">All Users</h2>

          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-full my-2" />
            ))
          ) : users.length === 0 ? (
            <p className="text-muted-foreground text-sm">No users found.</p>
          ) : (
            <>
              <table className="w-full text-sm mb-4">
                <thead>
                  <tr className="text-muted-foreground border-b">
                    <th className="text-left py-2">Name</th>
                    <th className="text-left py-2">Email</th>
                    <th className="text-left py-2">Role</th>
                    <th className="text-left py-2">Joined</th>
                    <th className="text-left py-2">Status</th>
                    <th className="py-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b">
                      <td className="py-2 font-medium">{user.name}</td>
                      <td className="py-2">{user.email}</td>
                      <td className="py-2 capitalize">{user.role}</td>
                      <td className="py-2">
                        {new Date(user.createdAt).toDateString()}
                      </td>
                      <td className="py-2">
                        {user.isVerified ? (
                          <span className="text-green-600 font-medium">
                            Verified
                          </span>
                        ) : (
                          <span className="text-yellow-600 font-medium">
                            Unverified
                          </span>
                        )}
                      </td>
                      <td className="py-2 text-center space-x-2">
                        {!user.isVerified && (
                          <Button
                            size="sm"
                            onClick={() => handleUserApproval(user.id)}
                            className="bg-blue-900 hover:bg-blue-800"
                          >
                            Verify
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="purpul"
                          onClick={() => handleUserDeletion(user.id)}
                        >
                          Revoke
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* 🔀 Pagination Controls */}
              <div className="flex justify-between items-center px-2">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </>
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
