"use client";

import { useRouter } from "next/navigation";

interface LoginButtonProps {
  children: React.ReactNode;
  mode?: "model" | "redirect";
  asChild?: boolean;
}

export const LoginButton = ({
  children,
  mode = "redirect",
}: LoginButtonProps) => {
  const router = useRouter();
  const onClick = () => {
    router.push("/auth/login");
  };
  if (mode === "model") {
    return <span>TODO: implementation model</span>;
  }
  return (
    <span className="cursor-pointer" onClick={onClick}>
      {children}
    </span>
  );
};
