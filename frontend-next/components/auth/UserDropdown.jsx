"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/components/auth/SessionProvider";
import { Button } from "@/components/ui/button";
import { LogOut, BarChart } from "lucide-react";
import { handleLogout } from "@/lib/authUtils";

export function UserDropdown() {
  const { user } = useAuth();

  const getRoleName = (role) => {
    return role === 1 ? "Administrator" : "Kasir";
  };

  // Pastikan user data sudah dimuat sebelum menampilkan informasi
  if (!user) {
    return (
      <Button variant="ghost" className="flex items-center gap-3 mt-2" disabled>
        <div className="text-right">
          <p className="font-">Loading...</p>
          <p className="text-xs text-muted-foreground">...</p>
        </div>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-3 mt-2">
          <div className="text-right">
            <p className="font-">{user.data.username}</p>
            <p className="text-xs text-muted-foreground">
              {getRoleName(user.data.role)}
            </p>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {/* Conditional rendering untuk menu berdasarkan role */}
        {user.data.role === 1 && (
          <DropdownMenuItem
            onClick={() => (window.location.href = "/dashboard")}
          >
            <BarChart className="w-4 h-4 mr-2" />
            Dashboard
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={handleLogout} className="text-red-600">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
