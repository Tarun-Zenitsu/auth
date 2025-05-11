"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { FaUser } from "react-icons/fa";
import { useCurrentUser } from "@/hooks/use-current-user";
import { LogoutButton } from "./logout-button";
import { BellPlus, LogOut } from "lucide-react";

const UserButton = () => {
  const user = useCurrentUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-3">
          {/* Bell icon with notification badge */}
          <div className="relative mr-3">
            <BellPlus className="text-white" size={24} />
            <div className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center bg-purple-500 text-white rounded-full text-[10px]">
              20
            </div>
          </div>

          {/* User name and role */}
          <div className="flex flex-col items-start text-left text-sm leading-tight">
            <span className="text-white font-bold text-base">{user?.name}</span>
            <span className="text-xs text-gray-300">{user?.role}</span>
          </div>

          {/* Avatar with hover effect */}
          <div className="rounded-full transition hover:bg-muted p-1 cursor-pointer">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.image || ""} />
              <AvatarFallback className="bg-sky-500">
                <FaUser className="text-white" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-40" align="end">
        <LogoutButton>
          <DropdownMenuItem>
            Logout
            <LogOut className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
