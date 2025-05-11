// components/recruiter/DashboardMetrics.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Briefcase, Users, CalendarCheck, BarChart } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const DashboardMetrics = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="bg-gradient-to-r from-rose-100 to-rose-200">
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

      <Card className="bg-gradient-to-r from-green-100 to-green-200">
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

      <Card className="bg-gradient-to-r from-yellow-100 to-yellow-200">
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

      <Card className="bg-gradient-to-r from-sky-100 to-sky-200">
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

export default DashboardMetrics;
