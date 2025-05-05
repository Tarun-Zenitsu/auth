"use client";

import { signOut } from "next-auth/react";

export const LogoutButton = ({ children }: { children: React.ReactNode }) => {
  const onclick = () => {
    signOut();
  };
  return (
    <span onClick={onclick} className="cursor-pointer">
      {children}
    </span>
  );
};
