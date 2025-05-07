import { auth } from "@/auth";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import RecruiterDashboard from "../_Components/RecruiterDashboard";

export default async function RecruiterPage() {
  const session = await auth();

  // ✅ Protect route
  if (
    !session ||
    ![UserRole.ADMIN, UserRole.RECRUITER].includes(session.user.role)
  ) {
    redirect("/unauthorized"); // or return a not-authorized UI
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RecruiterDashboard />
    </Suspense>
  );
}
