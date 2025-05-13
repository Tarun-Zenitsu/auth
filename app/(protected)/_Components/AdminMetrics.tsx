"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Briefcase, Users, BarChart, User } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import axios from "axios";

const AdminMetrics = () => {
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    pendingUsers: 0,
    openJobs: 0,
    closingSoon: 0,
    totalCandidates: 0,
    interviewing: 0,
    applicationProgress: 0,
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await axios.get("/api/admin/metrics");
        setMetrics(res.data);
      } catch (err) {
        console.error("Error fetching metrics", err);
      }
    };
    fetchMetrics();
  }, []);

  return (
    <div className="px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-rose-100 to-rose-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <User className="w-5 h-5" aria-hidden />
              Total Users
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

        <Card className="bg-gradient-to-r from-green-100 to-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Briefcase className="w-5 h-5" aria-hidden />
              Open Positions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-gray-900">
              {metrics.openJobs}
            </p>
            <p className="text-sm text-muted-foreground">
              {metrics.closingSoon} Closing Soon
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-100 to-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Users className="w-5 h-5" aria-hidden />
              Total Candidates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-gray-900">
              {metrics.totalCandidates}
            </p>
            <p className="text-sm text-muted-foreground">
              {metrics.interviewing} Interviewing
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-sky-100 to-sky-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <BarChart className="w-5 h-5" aria-hidden />
              Application Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={metrics.applicationProgress} />
            <p className="text-sm text-muted-foreground mt-2">
              {metrics.applicationProgress}% Completed
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminMetrics;
