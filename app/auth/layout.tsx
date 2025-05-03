import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-center justify-center bg-radial-[at_50%_75%] from-sky-300 via-blue-400 to-indigo-900 to-90% h-screen">
      {children}
    </div>
  );
};

export default AuthLayout;
