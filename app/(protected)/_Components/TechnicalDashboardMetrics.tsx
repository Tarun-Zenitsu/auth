"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileCheck, Mic, BadgeCheck, BarChart } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const TechnicalDashboardMetrics = () => {
  const metrics = {
    applicationsReviewed: 125,
    interviewsConducted: 78,
    offersMade: 24,
    progress: 82,
  };

  return (
    <div className="px-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 🔹 Applications Reviewed */}
        <Card className="bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-2xl shadow-sm text-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <FileCheck className="w-6 h-6" />
              Applications Reviewed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">
              {metrics.applicationsReviewed}
            </p>
            <p className="text-sm text-muted-foreground">
              Across All Positions
            </p>
          </CardContent>
        </Card>

        {/* 🔹 Interviews Conducted */}
        <Card className="bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl shadow-sm text-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Mic className="w-6 h-6" />
              Interviews Conducted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">
              {metrics.interviewsConducted}
            </p>
            <p className="text-sm text-muted-foreground">Technical Rounds</p>
          </CardContent>
        </Card>

        {/* 🔹 Offers Made */}
        <Card className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl shadow-sm text-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <BadgeCheck className="w-6 h-6" />
              Offers Made
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">
              {metrics.offersMade}
            </p>
            <p className="text-sm text-muted-foreground">Awaiting Acceptance</p>
          </CardContent>
        </Card>

        {/* 🔹 Pipeline Completion */}
        <Card className="bg-gradient-to-br from-sky-100 to-sky-200 rounded-2xl shadow-sm text-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <BarChart className="w-6 h-6" />
              Pipeline Completion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={metrics.progress} />
            <p className="text-sm text-muted-foreground mt-3">
              {metrics.progress}% of candidates completed technical steps
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TechnicalDashboardMetrics;
