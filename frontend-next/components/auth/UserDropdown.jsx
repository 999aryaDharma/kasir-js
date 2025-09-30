"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/components/auth/SessionProvider";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { handleLogout } from "@/lib/authUtils";

export function UserDropdown() {
	const { user } = useAuth();

	const getRoleName = (role) => {
		return role === 1 ? "Admin" : "Kasir";
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="flex items-center gap-3 mt-2">
					<div className="text-right">
						<p className="font-">{user?.username}</p>
						<p className="text-xs text-muted-foreground">{getRoleName(user?.role)}</p>
					</div>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={handleLogout} className="text-red-600">
					<LogOut className="w-4 h-4 mr-2" />
					Logout
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
