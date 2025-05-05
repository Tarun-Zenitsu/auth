// "use client";

// import RoleGate from "@/components/auth/role-gate";
// import { FormSuccess } from "@/components/form-success";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { useCurrentRole } from "@/hooks/use-current-role";
// import { useCurrentUser } from "@/hooks/use-current-user";
// import { UserRole } from "@prisma/client";
// import { signOut, useSession } from "next-auth/react";

// const RecruiterPage = () => {
//   return (
//     <Card className="w-[600px]">
//       <CardHeader>
//         <p className="text-2xl font-semibold text-center">Recruiter</p>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         <RoleGate allowedRoles={[UserRole.RECRUITER, UserRole.ADMIN]}>
//           <FormSuccess message="You are allowed to see this" />
//         </RoleGate>
//       </CardContent>
//     </Card>
//   );
// };

// export default RecruiterPage;

"use client";

import { useState } from "react";
import { UserRole } from "@prisma/client";
import { FormSuccess } from "@/components/form-success";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BarChart, Users, Briefcase, CalendarCheck, Plus } from "lucide-react";
import RoleGate from "@/components/auth/role-gate";
import { NewJobForm } from "../_Components/NewJobForm";

const RecruiterPage = () => {
  const [open, setOpen] = useState(false);

  return (
    <RoleGate allowedRoles={[UserRole.RECRUITER, UserRole.ADMIN]}>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Recruiter Dashboard</h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create New Job
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a New Job Posting</DialogTitle>
              </DialogHeader>
              <NewJobForm onSuccess={() => setOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        <FormSuccess message="You are allowed to see this" />

        {/* Dashboard Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Open Positions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">8</p>
              <p className="text-sm text-muted-foreground">3 Closing Soon</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Total Candidates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">52</p>
              <p className="text-sm text-muted-foreground">10 Interviewing</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarCheck className="w-5 h-5" />
                Interviews Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">3</p>
              <p className="text-sm text-muted-foreground">Next at 2:00 PM</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="w-5 h-5" />
                Application Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={65} />
              <p className="text-sm text-muted-foreground mt-2">
                65% Completed
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Candidates */}
        <Tabs defaultValue="applied">
          <TabsList>
            <TabsTrigger value="applied">Applied</TabsTrigger>
            <TabsTrigger value="shortlisted">Shortlisted</TabsTrigger>
            <TabsTrigger value="interviewed">Interviewed</TabsTrigger>
            <TabsTrigger value="hired">Hired</TabsTrigger>
          </TabsList>

          <TabsContent value="applied">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((id) => (
                <Card key={id}>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={`/avatars/user${id}.png`} />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">John Doe</h4>
                        <p className="text-sm text-muted-foreground">
                          Frontend Developer
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex justify-between">
                    <Badge variant="outline">Applied</Badge>
                    <Button size="sm" variant="secondary">
                      View Profile
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </RoleGate>
  );
};

export default RecruiterPage;
