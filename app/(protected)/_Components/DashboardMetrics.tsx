"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Briefcase, Users, CalendarCheck, BarChart } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import axios from "axios";

const DashboardMetrics = () => {
  const [metrics, setMetrics] = useState({
    openPositions: 0,
    closingSoon: 0,
    totalCandidates: 0,
    interviewing: 0,
    interviewsToday: 0,
    nextInterviewTime: "",
    progress: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get("/api/requisitions/metrics");
        setMetrics(response.data);
      } catch (error) {
        console.error("Failed to fetch metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="h-[120px] animate-pulse bg-muted" />
        ))}
      </div>
    );
  }

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
          <p className="text-2xl font-semibold">{metrics.openPositions}</p>
          <p className="text-sm text-muted-foreground">
            {metrics.closingSoon} Closing Soon
          </p>
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
          <p className="text-2xl font-semibold">{metrics.totalCandidates}</p>
          <p className="text-sm text-muted-foreground">
            {metrics.interviewing} Interviewing
          </p>
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
          <p className="text-2xl font-semibold">{metrics.interviewsToday}</p>
          <p className="text-sm text-muted-foreground">
            Next at {metrics.nextInterviewTime || "—"}
          </p>
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
          <Progress value={metrics.progress} />
          <p className="text-sm text-muted-foreground mt-2">
            {metrics.progress}% Completed
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardMetrics;
