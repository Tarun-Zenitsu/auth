"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { UserRole } from "@prisma/client";

const roleRouteMap: Record<UserRole, { label: string; path: string }> = {
  ADMIN: { label: "Dashboard", path: "/admin" },
  RECRUITER: { label: "Dashboard", path: "/recruiter" },
  HIRING_MANAGER: { label: "Dashboard", path: "/hiringManager" },
  TECHNICAL_TEAM: { label: "Dashboard", path: "/technical" },
  CANDIDATE: { label: "Dashboard", path: "/candidate" },
  AUDITOR: { label: "Dashboard", path: "/auditor" },
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

  const allTabs = [
    ...(roleLink ? [roleLink] : []),
    { label: "Statistics", path: "/statistics" },
    { label: "Settings", path: "/settings" },
    // { label: "Recruiter", path: "/recruiter" },
    // { label: "Hiring Manager", path: "/hiringManager" },
    // { label: "Technical Team", path: "/technical" },
    // { label: "Candidate", path: "/candidate" },
  ];

  // Remove duplicates by path
  const seenPaths = new Set<string>();
  const tabs = allTabs.filter((tab) => {
    if (seenPaths.has(tab.path)) return false;
    seenPaths.add(tab.path);
    return true;
  });

  return (
    <div className="flex items-center justify-start w-fit m-3 mx-3 pt-20">
      <div className="flex px-2 py-1 rounded-full shadow-sm space-x-1 backdrop-blur-md bg-blue-200/30 border border-blue-300/50">
        {tabs.map((tab) => (
          <Link
            key={tab.path}
            href={tab.path}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              pathname === tab.path
                ? "bg-white shadow text-black"
                : "text-muted-foreground hover:bg-white/60"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
