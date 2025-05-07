// app/(dashboard)/candidate/page.tsx (No changes needed here)
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import CandidateDashboard from "../_Components/CandidateDashboard";

export default async function CandidatePage() {
  const session = await auth();

  if (!session || session.user.role !== "CANDIDATE") {
    redirect("/unauthorized");
  }

  return <CandidateDashboard />;
}
