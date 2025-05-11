// import React from "react";
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

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex">
      {/* LEFT */}
      {/* <div className="w-[20%] md:w-[8%] lg:w-[20%] xl:w-[14%] p-4 shadow-sm bg-blue-950 backdrop-blur-md">
        <Link
          href="/"
          className="flex items-center justify-center lg:justify-start gap-2"
        > */}
      {/* <Image src="/logo.png" alt="logo" width={32} height={32} /> */}
      {/* <div className="flex items-center gap-2 font-bold">
            <Image src="/logo2.png" alt="logo" width={40} height={40} />
            <button className="text-left bg-transparent border-none p-0 cursor-pointer text-xs">
              queensland university of technology
            </button>
          </div>
        </Link>
        <Menue />
      </div> */}
      {/* RIGHT */}
      <div className="w-full bg-white overflow-scroll flex flex-col">
        <Navbar />
        <Menue />
        {children}
      </div>
    </div>
  );
}
