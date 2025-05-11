"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ClipboardList, CheckCircle, PauseCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const CandidateMetrics = () => {
  // Simulated data — replace with real API call later
  const metrics = {
    totalApplications: 12,
    shortlisted: 3,
    interviewStage: 2,
    onHold: 1,
    rejected: 4,
    progress: 50, // % of applications in active consideration (shortlisted + interview)
  };

  return (
    <div className="px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* 🔹 Total Applications */}
        <Card className="bg-gradient-to-r from-purple-100 to-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <ClipboardList className="w-5 h-5" />
              Applications Submitted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-gray-900">
              {metrics.totalApplications}
            </p>
            <p className="text-sm text-muted-foreground">
              {metrics.shortlisted} Shortlisted
            </p>
          </CardContent>
        </Card>

        {/* 🔹 Interview Stage */}
        <Card className="bg-gradient-to-r from-green-100 to-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <CheckCircle className="w-5 h-5" />
              Interview Stage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-gray-900">
              {metrics.interviewStage}
            </p>
            <p className="text-sm text-muted-foreground">Progressing well</p>
          </CardContent>
        </Card>

        {/* 🔹 On Hold / Rejected */}
        <Card className="bg-gradient-to-r from-yellow-100 to-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <PauseCircle className="w-5 h-5" />
              On Hold / Rejected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-gray-900">
              {metrics.onHold + metrics.rejected}
            </p>
            <p className="text-sm text-muted-foreground">
              {metrics.rejected} Rejected
            </p>
          </CardContent>
        </Card>

        {/* 🔹 Progress Bar */}
        <Card className="bg-gradient-to-r from-blue-100 to-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <CheckCircle className="w-5 h-5" />
              Application Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={metrics.progress} />
            <p className="text-sm text-muted-foreground mt-2">
              {metrics.progress}% in active consideration
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CandidateMetrics;
