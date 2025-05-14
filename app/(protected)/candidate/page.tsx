// app/(dashboard)/candidate/page.tsx (No changes needed here)
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import CandidateDashboard from "../_Components/CandidateDashboard";
import { UserRole } from "@prisma/client";

export default async function CandidatePage() {
  const session = await auth();

  if (
    !session ||
    ![UserRole.ADMIN, UserRole.CANDIDATE].includes(session.user.role)
  ) {
    redirect("/unauthorized"); // or return a not-authorized UI
  }

  return <CandidateDashboard />;
}
