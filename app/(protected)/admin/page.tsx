import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminDashboard from "../_Components/AdminDashboard";

export default async function AdminPage() {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/unauthorized"); // Or return a <NotAuthorized /> component
  }

  return <AdminDashboard />;
}
