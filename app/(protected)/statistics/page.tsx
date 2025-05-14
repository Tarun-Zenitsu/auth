"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Users, BadgeCheck, ThumbsDown, Clock, UserCheck } from "lucide-react";

interface Metrics {
  total: number;
  shortlisted: number;
  rejected: number;
  hold: number;
  interview: number;
}

interface JobApplicationStats {
  jobTitle: string;
  count: number;
}

export default function AdminStatisticsPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [appsPerJob, setAppsPerJob] = useState<JobApplicationStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/statistics");
        const data = await res.json();
        setMetrics(data.metrics);
        setAppsPerJob(data.appsPerJob);
      } catch (error) {
        console.error("Error fetching stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-6 space-y-8">
      <div className="space-y-1">
        <h2 className="text-3xl font-semibold tracking-tight">
          Application Statistics
        </h2>
        <p className="text-muted-foreground text-sm">
          Overview of all applications by stage and job title.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))
        ) : metrics ? (
          <>
            <GradientStatCard
              title="Total Applications"
              value={metrics.total}
              icon={<Users className="w-5 h-5 text-gray-700" />}
              gradient="from-blue-100 to-blue-200"
            />
            <GradientStatCard
              title="Shortlisted"
              value={metrics.shortlisted}
              icon={<BadgeCheck className="w-5 h-5 text-gray-700" />}
              gradient="from-green-100 to-green-200"
            />
            <GradientStatCard
              title="Rejected"
              value={metrics.rejected}
              icon={<ThumbsDown className="w-5 h-5 text-gray-700" />}
              gradient="from-red-100 to-red-200"
            />
            <GradientStatCard
              title="On Hold"
              value={metrics.hold}
              icon={<Clock className="w-5 h-5 text-gray-700" />}
              gradient="from-yellow-100 to-yellow-200"
            />
            <GradientStatCard
              title="Interview Stage"
              value={metrics.interview}
              icon={<UserCheck className="w-5 h-5 text-gray-700" />}
              gradient="from-purple-100 to-purple-200"
            />
          </>
        ) : null}
      </div>

      {/* Applications Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Applications per Job</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-64 w-full rounded-xl" />
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={appsPerJob}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="jobTitle" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                  }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Gradient Card Component
function GradientStatCard({
  title,
  value,
  icon,
  gradient,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  gradient: string;
}) {
  return (
    <Card className={`bg-gradient-to-r ${gradient}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-800">
          {icon} {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </CardContent>
    </Card>
  );
}
