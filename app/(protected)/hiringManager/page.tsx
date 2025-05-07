// app/(dashboard)/job-approval/page.tsx (Server Component)
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import JobApproval from "../_Components/job-approval";

export default async function JobApprovalPage() {
  const session = await auth();

  // Server-side protection
  if (!session || !["ADMIN", "HIRING_MANAGER"].includes(session.user.role)) {
    redirect("/unauthorized");
  }

  return (
    <div className="mt-15">
      <JobApproval />
    </div>
  );
}
