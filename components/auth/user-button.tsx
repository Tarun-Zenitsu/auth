"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { FaUser } from "react-icons/fa";
import { useCurrentUser } from "@/hooks/use-current-user";
import { LogoutButton } from "./logout-button";
import { BellPlus, LogOut } from "lucide-react";
import { useEffect, useState } from "react";

type NotificationItem = {
  id?: string;
  type: string;
  message: string;
  createdAt?: string;
};

const UserButton = () => {
  const user = useCurrentUser();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/notifications", { cache: "no-store" });
        if (res.ok) {
          const data: NotificationItem[] = await res.json();
          setNotifications(data);
        }
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="flex items-center gap-3">
      {/* Notification Bell Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="relative cursor-pointer"
            aria-label="Notifications"
          >
            <BellPlus className="text-white" size={24} />
            {!loading && notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center bg-purple-500 text-white rounded-full text-[10px]">
                {notifications.length}
              </span>
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-80 max-h-72 overflow-y-auto"
        >
          <DropdownMenuLabel className="text-sm font-semibold">
            Notifications
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {loading ? (
            <DropdownMenuItem disabled>Loading...</DropdownMenuItem>
          ) : notifications.length === 0 ? (
            <DropdownMenuItem disabled>No new notifications</DropdownMenuItem>
          ) : (
            notifications.map((notif, idx) => (
              <DropdownMenuItem
                key={idx}
                className="whitespace-normal break-words text-sm"
              >
                {notif.message}
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* User Info & Avatar Dropdown */}
      <DropdownMenu>
        <div className="flex items-center gap-2">
          {/* Name and Role (static, not clickable) */}
          <div className="flex flex-col items-start text-left text-sm leading-tight">
            <span className="text-white font-bold text-base">{user?.name}</span>
            <span className="text-xs text-gray-300">{user?.role}</span>
          </div>

          {/* Avatar (clickable trigger) */}
          <DropdownMenuTrigger asChild>
            <button className="rounded-full transition hover:bg-muted p-1">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.image || ""} />
                <AvatarFallback className="bg-sky-500">
                  <FaUser className="text-white" />
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
        </div>

        <DropdownMenuContent className="w-40" align="end">
          <LogoutButton>
            <DropdownMenuItem>
              Logout
              <LogOut className="ml-auto h-4 w-4" />
            </DropdownMenuItem>
          </LogoutButton>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserButton;
