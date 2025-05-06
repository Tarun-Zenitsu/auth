"use client";

import { useEffect, useState } from "react";
import { UserRole, Requisition } from "@prisma/client";
import RoleGate from "@/components/auth/role-gate";
import { FormSuccess } from "@/components/form-success";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { NewJobForm } from "../_Components/NewJobForm";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const RecruiterPage = () => {
  const [open, setOpen] = useState(false);
  const [requisitions, setRequisitions] = useState<Requisition[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRequisitions = async () => {
      try {
        const res = await axios.get("/api/requisitions");
        setRequisitions(res.data);
      } catch (err) {
        console.error("Failed to load requisitions", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequisitions();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <Badge className="bg-green-500 hover:bg-green-600 text-white">
            Approved
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className="bg-red-500 hover:bg-red-600 text-white">
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
            Pending
          </Badge>
        );
    }
  };

  return (
    <RoleGate allowedRoles={[UserRole.RECRUITER, UserRole.ADMIN]}>
      <div className="p-6 space-y-6 mt-20 bg-white rounded-xl shadow-md max-w-6xl mx-auto w-full h-[80vh] flex flex-col">
        <div className="flex justify-between items-center sticky top-0 bg-white z-10 pb-2 border-b">
          <h1 className="text-3xl font-bold">Recruiter Dashboard</h1>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create New Job
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a New Job Posting</DialogTitle>
              </DialogHeader>
              <NewJobForm onSuccess={() => setOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        <FormSuccess message="You are allowed to manage job requisitions." />

        <div className="flex-1 overflow-y-auto rounded-lg border">
          <table className="min-w-full table-auto text-sm">
            <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Job Title</th>
                <th className="px-6 py-3 text-left font-semibold">
                  Department
                </th>
                <th className="px-6 py-3 text-left font-semibold">Location</th>
                <th className="px-6 py-3 text-left font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-32" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-20" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-16" />
                    </td>
                  </tr>
                ))
              ) : requisitions.length > 0 ? (
                requisitions.map((req, index) => (
                  <tr
                    key={req.id}
                    className={`border-t ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4 font-medium">{req.jobTitle}</td>
                    <td className="px-6 py-4">{req.department}</td>
                    <td className="px-6 py-4">{req.location}</td>
                    <td className="px-6 py-4">{getStatusBadge(req.status)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-6 text-center text-muted-foreground"
                  >
                    No requisitions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </RoleGate>
  );
};

export default RecruiterPage;
