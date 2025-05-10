// import React from "react";
import Image from "next/image";
import Menue from "./_Components/Menue";
import Navbar from "./_Components/Navbar";

// const layout = ({ children }: { children: React.ReactNode }) => {
//   return (
//     <div className="w-full flex flex-col gap-y-10 items-center justify-center bg-gradient-to-b bg-gray-100 from-gray-200 to-gray-300  h-screen">
//       <Navbar />
//       {children}
//     </div>
//   );
// };

// export default layout;

import Link from "next/link";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex">
      {/* LEFT */}
      <div className="w-[20%] md:w-[8%] lg:w-[20%] xl:w-[14%] p-4 shadow-sm bg-blue-500/20 backdrop-blur-md">
        <Link
          href="/"
          className="flex items-center justify-center lg:justify-start gap-2"
        >
          {/* <Image src="/logo.png" alt="logo" width={32} height={32} /> */}
          <div className="flex items-center gap-2 font-bold">
            <Image src="/logo2.png" alt="logo" width={40} height={40} />
            <button className="text-left bg-transparent border-none p-0 cursor-pointer text-xs">
              queensland university of technology
            </button>
          </div>
        </Link>
        <Menue />
      </div>
      {/* RIGHT */}
      <div className="w-[80%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#e7e7e8] overflow-scroll flex flex-col">
        <Navbar />
        {children}
      </div>
    </div>
  );
}
