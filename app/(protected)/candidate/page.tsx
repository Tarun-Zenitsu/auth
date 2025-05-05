"use client";

import RoleGate from "@/components/auth/role-gate";
import { FormSuccess } from "@/components/form-success";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserRole } from "@prisma/client";

const CandidatePage = () => {
  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">Recruiter</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <RoleGate allowedRoles={[UserRole.CANDIDATE, UserRole.ADMIN]}>
          <FormSuccess message="You are allowed to see this" />
        </RoleGate>
      </CardContent>
    </Card>
  );
};

export default CandidatePage;
