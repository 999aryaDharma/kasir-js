"use client";

import { useAuth } from "@/components/auth/SessionProvider";
import { handleLogout } from "@/lib/authUtils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { LogOut, BarChart, ShoppingCart } from "lucide-react";

export default function Header({ title = "Dashboard" }) {
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

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-8 shadow-sm">
      {/* Left side - Title */}
      <div>
        <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
      </div>

      {/* Right side - User actions */}
      <div className="flex items-center space-x-4">
        {!user ? (
          // Skeleton loader yang bagus untuk profil
          <div className="flex items-center space-x-3">
            <div className="w-24 space-y-1 text-left">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-auto justify-start space-x-3 px-2"
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
              {user.role === 1 && (
                <DropdownMenuItem
                  onClick={() => (window.location.href = "/dashboard")}
                >
                  <BarChart className="w-4 h-4 mr-2" />
                  Dashboard
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => (window.location.href = "/pos")}>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Ke Kasir
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
