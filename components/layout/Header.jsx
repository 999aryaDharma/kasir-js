"use client";

import { useState } from "react";
import { User, LogOut, Bell, CircleUser as UserCircle, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";

export default function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // Mock data user - nanti bisa diganti dengan data dari context/state management
  const currentUser = {
    name: "Admin User",
    email: "admin@kasirpos.com",
    role: "Administrator",
    avatar: null
  };

  const handleLogout = () => {
    // Implementasi logout nanti
    console.log("Logout clicked");
    setIsProfileOpen(false);
  };

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6 shadow-sm">
      {/* Left side - Title */}
      <div>
        <h1 className="text-xl font-semibold text-gray-800">
          Dashboard Kasir POS
        </h1>
      </div>

      {/* Right side - User actions */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            3
          </span>
        </Button>

        {/* User Profile */}
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-700">
              {currentUser.name}
            </p>
            <p className="text-xs text-gray-500">{currentUser.role}</p>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => setIsProfileOpen(true)}
          >
            {currentUser.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="h-8 w-8 rounded-full"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                <User className="h-4 w-4" />
              </div>
            )}
          </Button>
        </div>
      </div>

      {/* Profile Dialog */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Menu Akun</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* User Info */}
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                <User className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{currentUser.name}</h3>
                <p className="text-sm text-gray-600">{currentUser.email}</p>
                <p className="text-sm text-gray-500">{currentUser.role}</p>
              </div>
            </div>

            {/* Menu List */}
            <div className="space-y-2">
              <Link href="/profile" onClick={() => setIsProfileOpen(false)}>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                >
                  <UserCircle className="mr-2 h-4 w-4" />
                  Profile
                </Button>
              </Link>
              
              <Link href="/pos" onClick={() => setIsProfileOpen(false)}>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Ke Kasir
                </Button>
              </Link>
              
              <Button
                variant="outline"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}