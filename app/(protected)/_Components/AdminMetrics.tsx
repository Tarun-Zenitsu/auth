// components/recruiter/AdminMetrics.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Briefcase, Users, BarChart, User } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const AdminMetrics = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-1">
            <User className="w-5 h-5" />
            Total User
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">120</p>
          <p className="text-sm text-muted-foreground">3 Pnding</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-1">
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
            <BarChart className="w-5 h-5" />
            Application Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={65} />
          <p className="text-sm text-muted-foreground mt-2">65% Completed</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMetrics;
