"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, Home, ShoppingCart, BarChart, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
	{ href: "/dashboard", label: "Dashboard", icon: Home },
	{ href: "/categories", label: "Kategori", icon: Tag },
	{ href: "/products", label: "Produk", icon: Package },
	{ href: "/transactions", label: "Transaksi (POS)", icon: ShoppingCart },
	{ href: "/reports", label: "Laporan", icon: BarChart },
];

export default function Sidebar() {
	const pathname = usePathname();

	return (
		<aside className="w-64 flex-shrink-0 border-r bg-gray-100 dark:bg-gray-800">
			<div className="flex h-16 items-center justify-center border-b">
				<Package className="h-6 w-6" />
				<span className="ml-2 font-semibold">Kasir POS</span>
			</div>
			<nav className="p-4">
				<ul>
					{navItems.map((item) => (
						<li key={item.href}>
							<Link
								href={item.href}
								className={cn("flex items-center rounded-md px-3 py-3 mb-4 text-sm font-medium transition-colors", pathname === item.href ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-gray-200 dark:hover:bg-gray-700")}
							>
								<item.icon className="mr-3 h-5 w-5" />
								{item.label}
							</Link>
						</li>
					))}
				</ul>
			</nav>
		</aside>
	);
}
