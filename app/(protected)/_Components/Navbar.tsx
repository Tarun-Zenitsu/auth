"use client";

import UserButton from "@/components/auth/user-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();
  return (
    <nav className="flex justify-between items-center p-4 rounded-xl w-[600px] shadow-sm absolute top-4 bg-blue-500/20 backdrop-blur-md">
      <div className="flex gap-x-2">
        <Button asChild variant={pathname === "/admin" ? "default" : "outline"}>
          <Link href="/admin">Admin</Link>
        </Button>
        <Button
          asChild
          variant={pathname === "/settings" ? "default" : "outline"}
        >
          <Link href="/settings">settings</Link>
        </Button>
        <Button
          asChild
          variant={pathname === "/recruiter" ? "default" : "outline"}
        >
          <Link href="/recruiter">Recruiter</Link>
        </Button>
        <Button
          asChild
          variant={pathname === "/hiringManager" ? "default" : "outline"}
        >
          <Link href="/hiringManager">Hiring Manager</Link>
        </Button>
        <Button
          asChild
          variant={pathname === "/candidate" ? "default" : "outline"}
        >
          <Link href="/candidate">Candidate</Link>
        </Button>
      </div>
      <UserButton />
    </nav>
  );
};

export default Navbar;
