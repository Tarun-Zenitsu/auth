"use client";

import UserButton from "@/components/auth/user-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();
  return (
    <nav className="flex justify-between items-center p-4 w-full shadow-sm bg-blue-500/20 backdrop-blur-md  top-0 left-0 z-50">
      <div className="flex gap-x-2 mt-2">
        <Button asChild variant={pathname === "/admin" ? "default" : "outline"}>
          <Link href="/admin">Admin</Link>
        </Button>
        <Button
          asChild
          variant={pathname === "/settings" ? "default" : "outline"}
        >
          <Link href="/settings">Settings</Link>
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
          variant={pathname === "/technical" ? "default" : "outline"}
        >
          <Link href="/technical">Technical Team</Link>
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
