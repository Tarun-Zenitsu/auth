"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserRole } from "@prisma/client";
import { Settings, BarChart2, LayoutDashboard } from "lucide-react";

const roleRouteMap: Record<UserRole, { label: string; path: string }> = {
  ADMIN: { label: "Admin Dashboard", path: "/admin" },
  RECRUITER: { label: "Recruiter Dashboard", path: "/recruiter" },
  HIRING_MANAGER: { label: " Dashboard", path: "/hiringManager" },
  TECHNICAL_TEAM: { label: " Dashboard", path: "/technical" },
  CANDIDATE: { label: "Dashboard", path: "/candidate" },
  AUDITOR: { label: "Auditor Dashboard", path: "/auditor" }, // Optional
};

export default function Menue() {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const res = await fetch("/api/auth/session");
      if (res.ok) {
        const session = await res.json();
        setUserRole(session?.user?.role ?? null);
      }
    };

    fetchSession();
  }, []);

  const roleLink = userRole ? roleRouteMap[userRole] : null;

  return (
    <nav className="flex justify-between flex-col items-center w-full ">
      <div className="flex gap-y-3 flex-col w-full mt-7">
        <Button
          asChild
          variant={pathname === "/settings" ? "default" : "outline"}
          className="w-[100%] text-base"
        >
          <Link href="/settings">
            <Settings /> Settings
          </Link>
        </Button>
        <Button
          asChild
          variant={pathname === "/statistics" ? "default" : "outline"}
          className="w-[100%] text-base"
        >
          <Link href="/statistics" className="size-7">
            <BarChart2 />
            Statistics
          </Link>
        </Button>

        {roleLink && (
          <Button
            asChild
            variant={pathname === roleLink.path ? "default" : "outline"}
            className="w-full text-base"
          >
            <Link href={roleLink.path} className="w-full">
              <LayoutDashboard />
              {roleLink.label}
            </Link>
          </Button>
        )}
      </div>
    </nav>
  );
}
