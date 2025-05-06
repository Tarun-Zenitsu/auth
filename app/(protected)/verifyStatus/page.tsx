import { currentUser } from "@/lib/auth"; // Adjust the path to your actual auth helper
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const VerifyStatusPage = async () => {
  const user = await currentUser();

  // If not logged in, redirect to login
  if (!user?.email) {
    redirect("/auth/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email },
  });

  // If user not found in DB, redirect
  if (!dbUser) {
    redirect("/auth/login");
  }

  // If verified, redirect based on role
  if (dbUser.isVerified) {
    switch (dbUser.role) {
      case "ADMIN":
        redirect("/admin");
      case "RECRUITER":
        redirect("/recruiter");
      case "HR":
        redirect("/hr");
      case "AUDITOR":
        redirect("/auditor");
      case "CANDIDATE":
      default:
        redirect("/dashboard");
    }
  }

  // If not verified, show waiting UI
  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-xl font-bold text-center">
            Awaiting Verification
          </h1>
        </CardHeader>
        <CardContent className="text-center space-y-2">
          <p>
            Hello, <strong>{dbUser.name}</strong>.
          </p>
          <p>Your account is pending approval by an admin.</p>
          <p className="text-sm text-muted-foreground">
            Please wait, we’ll redirect you once verified.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyStatusPage;
