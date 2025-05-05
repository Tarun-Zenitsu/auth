import React from "react";
import Navbar from "./_Components/Navbar";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full flex flex-col gap-y-10 items-center justify-center bg-gradient-to-b bg-gray-100 from-gray-600 to-gray-700  h-screen">
      <Navbar />
      {children}
    </div>
  );
};

export default layout;
