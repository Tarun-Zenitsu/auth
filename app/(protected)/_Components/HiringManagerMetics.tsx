"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Briefcase, Users, BarChart, User } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

interface Metrics {
  totalUsers: number;
  pendingUsers: number;
  openPositions: number;
  closingSoon: number;
  totalCandidates: number;
  interviewing: number;
  progress: number;
}

const HiringManagerMetrics = () => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    axios
      .get("/api/hiring-manager")
      .then((res) => setMetrics(res.data))
      .catch((err) => {
        console.error("Error fetching metrics:", err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  if (error) {
    return (
      <div className="px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Could not load metrics. Please try again later.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const MetricCardSkeleton = () => (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
    </Card>
  );

  if (loading || !metrics) {
    return (
      <div className="px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCardSkeleton />
          <MetricCardSkeleton />
          <MetricCardSkeleton />
          <MetricCardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Job Requisitions */}
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

        {/* Approved Jobs */}
        <Card className="bg-gradient-to-r from-green-100 to-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Briefcase className="w-5 h-5" aria-hidden />
              Approved Jobs
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

        {/* Total Candidates */}
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

        {/* Application Progress */}
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
