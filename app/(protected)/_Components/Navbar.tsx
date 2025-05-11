// "use client";

// import UserButton from "@/components/auth/user-button";
// import { Button } from "@/components/ui/button";
// import { Search } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import { usePathname } from "next/navigation";

// const Navbar = () => {
//   const pathname = usePathname();
//   return (
//     <nav className="flex justify-between items-center p-4 w-full shadow-sm  top-0 left-0 z-50 bg-blue-950">
//       <div className="flex gap-x-2 mt-1">
//         <div className="flex items-center gap-2 font-bold">
//           <Image src="/logo2.png" alt="logo" width={40} height={40} />
//           <p className="text-left text-xs text-white font-bold">
//             queensland <br />
//             university <br />
//             of technology
//           </p>
//         </div>
//         {/* <Button asChild variant={pathname === "/admin" ? "purpul" : "outline"}>
//           <Link href="/admin">Admin</Link>
//         </Button>
//         <Button
//           asChild
//           variant={pathname === "/settings" ? "default" : "outline"}
//         >
//           <Link href="/settings">Settings</Link>
//         </Button>
//         <Button
//           asChild
//           variant={pathname === "/recruiter" ? "default" : "outline"}
//         >
//           <Link href="/recruiter">Recruiter</Link>
//         </Button>
//         <Button
//           asChild
//           variant={pathname === "/hiringManager" ? "default" : "outline"}
//         >
//           <Link href="/hiringManager">Hiring Manager</Link>
//         </Button>
//         <Button
//           asChild
//           variant={pathname === "/technical" ? "default" : "outline"}
//         >
//           <Link href="/technical">Technical Team</Link>
//         </Button>
//         <Button
//           asChild
//           variant={pathname === "/candidate" ? "default" : "outline"}
//         >
//           <Link href="/candidate">Candidate</Link>
//         </Button> */}
//         {/* <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 shadow-lg">
//           <Search />
//           <input
//             type="text"
//             placeholder="Search..."
//             className="w-[400px] bg-transparent outline-none"
//           />
//         </div> */}
//       </div>
//       <UserButton />
//     </nav>
//   );
// };

// export default Navbar;

"use client";

import UserButton from "@/components/auth/user-button";
import Image from "next/image";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center p-4 shadow-sm bg-blue-950">
      <div className="flex gap-x-2 mt-1">
        <div className="flex items-center gap-2 font-bold">
          <Image src="/logo2.png" alt="logo" width={40} height={40} />
          <p className="text-left text-xs text-white font-bold leading-tight">
            queensland <br />
            university <br />
            of technology
          </p>
        </div>
      </div>
      <UserButton />
    </nav>
  );
};

export default Navbar;
