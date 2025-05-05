"use client";

import RoleGate from "@/components/auth/role-gate";
import { FormSuccess } from "@/components/form-success";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useCurrentRole } from "@/hooks/use-current-role";
import { useCurrentUser } from "@/hooks/use-current-user";
import { UserRole } from "@prisma/client";
import { signOut, useSession } from "next-auth/react";

const page = () => {
  const user = useCurrentUser();
  const role = useCurrentRole();
  const onclick = () => {
    signOut();
  };
  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">Admin</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <RoleGate allowedRoles={[UserRole.ADMIN]}>
          <FormSuccess message="You are allowed to see this" />
        </RoleGate>
      </CardContent>
    </Card>
  );
};

export default page;
