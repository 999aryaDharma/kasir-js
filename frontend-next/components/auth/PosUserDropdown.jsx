"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/components/auth/SessionProvider";
import { Button } from "@/components/ui/button";
import { LogOut, BarChart, ShoppingCart } from "lucide-react";
import { handleLogout } from "@/lib/authUtils";
import { Skeleton } from "@/components/ui/skeleton";

export function PosUserDropdown() {
  const { user } = useAuth();

  const getRoleName = (role) => {
    return role === 1 ? "Administrator" : "Kasir";
  };

  const getInitials = (name) => {
    if (!name) return "";
    const words = name.split(" ").filter(Boolean); // filter(Boolean) untuk menghapus spasi ganda
    if (words.length >= 2) {
      // Ambil huruf pertama dari dua kata pertama
      return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
    } else if (words.length === 1) {
      // Ambil huruf pertama jika hanya ada satu kata
      return words[0].charAt(0).toUpperCase();
    }
    return ""; // Fallback jika nama kosong
  };

  // Pastikan user data sudah dimuat sebelum menampilkan informasi
  if (!user) {
    return (
      // Skeleton loader yang lebih baik, meniru UI final
      <Button
        variant="ghost"
        className="relative h-8 w-auto justify-start space-x-3 px-2"
        disabled
      >
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="w-24 space-y-1 text-left">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 w-auto justify-start space-x-1 px-2"
        >
          <div className="text-right">
            <p className="font-medium text-sm">{user.username}</p>
            <p className="text-xs text-muted-foreground">
              {getRoleName(user.role)}
            </p>
          </div>
          <Avatar className="h-8 w-8">
            {/* Hapus AvatarImage agar Fallback (inisial) selalu ditampilkan */}
            <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {/* Conditional rendering untuk menu berdasarkan role */}
        {user.role === 1 && (
          <DropdownMenuItem
            onClick={() => (window.location.href = "/dashboard")}
          >
            <BarChart className="w-4 h-4 mr-2" />
            Dashboard
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-600">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
