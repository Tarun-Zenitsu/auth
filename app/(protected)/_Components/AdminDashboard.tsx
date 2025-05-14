"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@prisma/client";
import axios from "axios";
import AdminMetrics from "./AdminMetrics";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const LIMIT = 10;

type UserWithFrontendRolesAndStatus = User & {
  frontendRoles?: { role: string; access: string }[];
  frontendStatus?: string;
};

const AdminDashboard = () => {
  const [users, setUsers] = useState<UserWithFrontendRolesAndStatus[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [addingRoleForUser, setAddingRoleForUser] = useState<string | null>(
    null
  );
  const [newRole, setNewRole] = useState("");
  const [editingRoleForUserIndex, setEditingRoleForUserIndex] = useState<{
    userId: string;
    index: number;
  } | null>(null);
  const [updatedRole, setUpdatedRole] = useState("");
  const [editingStatusForUser, setEditingStatusForUser] = useState<
    string | null
  >(null);
  const [newStatus, setNewStatus] = useState<string | null>("read"); // Default to 'read'
  const [availableRoles] = useState([
    "AUDITOR",
    "RECRUITER",
    "HIRING_MANAGER",
    "TECHNICAL_TEAM",
    "CANDIDATE",
  ]);
  const [availableStatuses] = useState(["read", "write", "full"]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get("/api/users/all", {
          params: { page, limit: LIMIT },
        });
        const initialUsers = res.data.users.map((user: User) => ({
          ...user,
          frontendRoles: user.role ? [{ role: user.role, access: "read" }] : [], // Default access to 'read'
          frontendStatus: "read", // Set default frontendStatus to 'read'
        }));
        setUsers(initialUsers);
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

  const handleAddRoleClick = (userId: string) => {
    setAddingRoleForUser(userId);
    setNewRole("");
  };

  const handleAddRoleToUser = (userId: string) => {
    if (!newRole) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              frontendRoles: [
                ...(u.frontendRoles || []),
                { role: newRole, access: "read" }, // Default access for new roles
              ],
            }
          : u
      )
    );
    setAddingRoleForUser(null);
  };

  const handleEditRoleClick = (
    userId: string,
    index: number,
    currentRole: string
  ) => {
    setEditingRoleForUserIndex({ userId, index });
    setUpdatedRole(currentRole);
  };

  const handleUpdateRole = (userId: string, index: number) => {
    if (!updatedRole) return;
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId && u.frontendRoles && u.frontendRoles[index]) {
          const updatedRoles = [...u.frontendRoles];
          updatedRoles[index] = { ...updatedRoles[index], role: updatedRole };
          return { ...u, frontendRoles: updatedRoles };
        }
        return u;
      })
    );
    setEditingRoleForUserIndex(null);
  };

  const handleEditStatusClick = (userId: string) => {
    setEditingStatusForUser(userId);
    setNewStatus(users.find((u) => u.id === userId)?.frontendStatus || "read");
  };

  const handleUpdateStatus = (userId: string) => {
    if (!newStatus) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, frontendStatus: newStatus } : u
      )
    );
    setEditingStatusForUser(null);
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <Card className="w-full bg-white shadow-md rounded-xl">
      <CardContent className="p-6">
        <AdminMetrics />
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-6">All Users</h2>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full rounded" />
              ))}
            </div>
          ) : users.length === 0 ? (
            <p className="text-center text-muted-foreground">No users found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted">
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Roles</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Joined</th>
                    <th className="px-4 py-3 text-left">Verification</th>
                    <th className="px-4 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium">{user.name}</td>
                      <td className="px-4 py-2">{user.email}</td>
                      <td className="px-4 py-2 space-y-2">
                        {(user.frontendRoles || []).map((r, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            {editingRoleForUserIndex?.userId === user.id &&
                            editingRoleForUserIndex?.index === idx ? (
                              <div className="flex items-center gap-2">
                                <Select
                                  onValueChange={setUpdatedRole}
                                  defaultValue={r.role}
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {availableRoles.map((role) => (
                                      <SelectItem key={role} value={role}>
                                        {role}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <Button
                                  size="sm"
                                  onClick={() => handleUpdateRole(user.id, idx)}
                                >
                                  Update
                                </Button>
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() =>
                                    setEditingRoleForUserIndex(null)
                                  }
                                >
                                  Cancel
                                </Button>
                              </div>
                            ) : (
                              <div className="text-xs bg-gray-100 rounded px-2 py-1 inline-block">
                                {r.role}
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() =>
                                    handleEditRoleClick(user.id, idx, r.role)
                                  }
                                  className="ml-1"
                                >
                                  Edit
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                        {addingRoleForUser === user.id && (
                          <div className="mt-2 flex flex-col sm:flex-row gap-2">
                            <Select onValueChange={setNewRole}>
                              <SelectTrigger className="w-44">
                                <SelectValue placeholder="Select Role" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableRoles.map((r) => (
                                  <SelectItem key={r} value={r}>
                                    {r}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button
                              size="sm"
                              onClick={() => handleAddRoleToUser(user.id)}
                              disabled={!newRole}
                            >
                              Add
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => setAddingRoleForUser(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleAddRoleClick(user.id)}
                          className="mt-2"
                        >
                          <PlusIcon className="h-4 w-4 mr-1" />
                          Add Role
                        </Button>
                      </td>
                      <td className="px-4 py-2">
                        {editingStatusForUser === user.id ? (
                          <div className="flex gap-2 items-center">
                            <Select
                              onValueChange={setNewStatus}
                              defaultValue={user.frontendStatus}
                            >
                              <SelectTrigger className="w-28">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {availableStatuses.map((s) => (
                                  <SelectItem key={s} value={s}>
                                    {s}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button
                              size="sm"
                              onClick={() => handleUpdateStatus(user.id)}
                            >
                              Update
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => setEditingStatusForUser(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="capitalize font-medium text-muted-foreground">
                              {user.frontendStatus}
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditStatusClick(user.id)}
                            >
                              Edit
                            </Button>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-2 text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={cn(
                            "text-sm font-medium",
                            user.isVerified
                              ? "text-green-600"
                              : "text-yellow-500"
                          )}
                        >
                          {user.isVerified ? "Verified" : "Unverified"}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-center space-x-2">
                        {!user.isVerified && (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleUserApproval(user.id)}
                          >
                            Verify
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleUserDeletion(user.id)}
                        >
                          Revoke
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {users.length > 0 && (
            <div className="flex justify-between items-center mt-6">
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
