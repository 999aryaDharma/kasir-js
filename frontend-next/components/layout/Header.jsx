"use client";

import { User, LogOut, Bell, CircleUser as UserCircle, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";

export default function Header() {
	// Mock data user - nanti bisa diganti dengan data dari context/state management
	const currentUser = {
		name: "Admin User",
		email: "admin@kasirpos.com",
		role: "Administrator",
		avatar: null,
	};

	const handleLogout = () => {
		// Implementasi logout nanti
		console.log("Logout clicked");
	};

	return (
		<header className="h-16 border-b bg-white flex items-center justify-between px-8 shadow-sm">
			{/* Left side - Title */}
			<div>
				<h1 className="text-xl font-semibold text-gray-800">Dashboard Kasir POS</h1>
			</div>

			{/* Right side - User actions */}
			<div className="flex items-center space-x-4">
				{/* Notifications */}
				{/* <Button variant="ghost" size="icon" className="relative">
					<Bell className="h-5 w-5" />
					<span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
				</Button> */}

				{/* User Profile */}
				<div className="flex items-center space-x-3">
					<div className="text-right">
						<p className="text-sm font-medium text-gray-700">{currentUser.name}</p>
						<p className="text-xs text-gray-500">{currentUser.role}</p>
					</div>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon" className="rounded-full">
								{currentUser.avatar ? (
									<img src={currentUser.avatar} alt={currentUser.name} className="h-8 w-8 rounded-full" />
								) : (
									<div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
										<User className="h-4 w-4" />
									</div>
								)}
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-56">
							<DropdownMenuLabel>
								<p className="font-semibold">{currentUser.name}</p>
								<p className="text-xs text-gray-500 font-normal">{currentUser.email}</p>
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<Link href="/profile" passHref>
								<DropdownMenuItem>
									<UserCircle className="mr-2 h-4 w-4" />
									<span>Profile</span>
								</DropdownMenuItem>
							</Link>
							<Link href="/pos" passHref>
								<DropdownMenuItem>
									<ShoppingCart className="mr-2 h-4 w-4" />
									<span>Ke Kasir</span>
								</DropdownMenuItem>
							</Link>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 focus:bg-red-50">
								<LogOut className="mr-2 h-4 w-4" />
								<span>Logout</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	);
}
