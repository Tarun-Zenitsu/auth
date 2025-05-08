import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Share2 } from "lucide-react";
import { Requisition } from "@prisma/client";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "APPROVED":
      return <Badge className="bg-green-500 text-white">Approved</Badge>;
    case "REJECTED":
      return <Badge className="bg-red-500 text-white">Rejected</Badge>;
    case "PENDING":
      return <Badge className="bg-yellow-500 text-white">Pending</Badge>;
    default:
      return <Badge className="bg-gray-500 text-white">{status}</Badge>;
  }
};

const JobTable = ({
  isLoading,
  requisitions,
  onViewApplications,
  onShareClick,
}: {
  isLoading: boolean;
  requisitions: Requisition[];
  onViewApplications: (reqId: string, title: string) => void;
  onShareClick: (reqId: string) => void;
}) => (
  <div className="flex-1 overflow-y-auto rounded-lg border">
    <table className="min-w-full table-auto text-sm">
      <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
        <tr>
          <th className="px-6 py-3 text-left font-semibold">Job Title</th>
          <th className="px-6 py-3 text-left font-semibold">Department</th>
          <th className="px-6 py-3 text-left font-semibold">Location</th>
          <th className="px-6 py-3 text-left font-semibold">Status</th>
          <th className="px-6 py-3 text-left font-semibold">Actions</th>
          <th className="px-6 py-3 text-left font-semibold">Applications</th>
        </tr>
      </thead>
      <tbody>
        {isLoading
          ? Array.from({ length: 3 }).map((_, idx) => (
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
                <td className="px-6 py-4">
                  <Skeleton className="h-4 w-12" />
                </td>
                <td className="px-6 py-4">
                  <Skeleton className="h-4 w-20" />
                </td>
              </tr>
            ))
          : requisitions.map((req) => (
              <tr key={req.id} className="border-t bg-white">
                <td className="px-6 py-4 font-medium">{req.jobTitle}</td>
                <td className="px-6 py-4">{req.department}</td>
                <td className="px-6 py-4">{req.location}</td>
                <td className="px-6 py-4">{getStatusBadge(req.status)}</td>
                <td className="px-6 py-4">
                  {req.status === "APPROVED" && !req.posted && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onShareClick(req.id)}
                    >
                      <Share2 className="w-4 h-4 mr-2" /> Share
                    </Button>
                  )}
                  {req.posted && (
                    <Badge className="bg-blue-500 text-white">Posted</Badge>
                  )}
                </td>
                <td className="px-6 py-4">
                  <Button
                    variant="link"
                    className="text-blue-600"
                    onClick={() => onViewApplications(req.id, req.jobTitle)}
                  >
                    View Applications
                  </Button>
                </td>
              </tr>
            ))}
      </tbody>
    </table>
  </div>
);

export default JobTable;
