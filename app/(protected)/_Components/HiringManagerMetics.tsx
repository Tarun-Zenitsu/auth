"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Briefcase, Users, BarChart, User } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const HiringManagerMetrics = () => {
  // Example realistic static metrics for Hiring Manager
  const metrics = {
    totalUsers: 67,
    pendingUsers: 2,
    openPositions: 5,
    closingSoon: 2,
    totalCandidates: 124,
    interviewing: 18,
    progress: 72, // Percent of all positions with at least one candidate
  };

  return (
    <div className="px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* 🔹 Total Users */}
        <Card className="bg-gradient-to-r from-rose-100 to-rose-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <User className="w-5 h-5" aria-hidden />
              Total Job Requisitions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-gray-900">
              {metrics.totalUsers}
            </p>
            <p className="text-sm text-muted-foreground">
              {metrics.pendingUsers} Pending
            </p>
          </CardContent>
        </Card>

        {/* 🔹 Open Positions */}
        <Card className="bg-gradient-to-r from-green-100 to-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Briefcase className="w-5 h-5" aria-hidden />
              Approv Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-gray-900">
              {metrics.openPositions}
            </p>
            <p className="text-sm text-muted-foreground">
              {metrics.closingSoon} Closing Soon
            </p>
          </CardContent>
        </Card>

        {/* 🔹 Total Candidates */}
        <Card className="bg-gradient-to-r from-yellow-100 to-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Users className="w-5 h-5" aria-hidden />
              Reject Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-gray-900">
              {metrics.totalCandidates}
            </p>
            <p className="text-sm text-muted-foreground">
              {metrics.interviewing} Progress
            </p>
          </CardContent>
        </Card>

        {/* 🔹 Application Progress */}
        <Card className="bg-gradient-to-r from-sky-100 to-sky-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <BarChart className="w-5 h-5" aria-hidden />
              Application Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={metrics.progress} />
            <p className="text-sm text-muted-foreground mt-2">
              {metrics.progress}% Completed
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HiringManagerMetrics;
