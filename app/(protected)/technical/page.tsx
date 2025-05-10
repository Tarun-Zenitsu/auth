// app/(protected)/technical/page.tsx

import { auth } from "@/auth";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import TechnicalDashboard from "../_Components/TechnicalDashboard"; // Adjust the path if needed

export default async function TechnicalPage() {
  const session = await auth();

  // ✅ Restrict access to only ADMIN and TECHNICAL_TEAM
  if (!session || ![UserRole.TECHNICAL_TEAM].includes(session.user.role)) {
    redirect("/unauthorized"); // You can customize this route or UI
  }

  return (
    <Suspense fallback={<div>Loading Technical Dashboard...</div>}>
      <TechnicalDashboard />
    </Suspense>
  );
}
