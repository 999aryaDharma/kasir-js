"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  Package,
  Home,
  ShoppingCart,
  BarChart,
  Tag,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/categories", label: "Kategori", icon: Tag },
  { href: "/products", label: "Produk", icon: Package },
  {
    id: "reports",
    label: "Laporan",
    icon: BarChart,
    children: [
      { href: "/reports/sales", label: "Laporan Penjualan" },
      { href: "/reports/finance", label: "Laporan Keuangan" },
      { href: "/reports/stock", label: "Laporan Stok" },
      { href: "/reports/category", label: "Laporan Kategori" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState("reports"); // Default menu laporan terbuka

  const handleMenuClick = (id) => {
    setOpenMenu(openMenu === id ? null : id);
  };

  return (
    <aside className="w-64 flex-shrink-0 border-r bg-gray-100 dark:bg-gray-800">
      <div className="flex h-16 items-center justify-center border-b">
        <Package className="h-6 w-6" />
        <span className="ml-2 font-semibold">Kasir POS</span>
      </div>
      <nav className="p-4">
        <ul className="space-y-1.5">
          {navItems.map((item) =>
            item.children ? (
              <li key={item.id}>
                <button
                  onClick={() => handleMenuClick(item.id)}
                  className={cn(
                    "flex w-full items-center rounded-md px-3 py-3 text-sm font-medium transition-colors",
                    item.children.some((child) =>
                      pathname.startsWith(child.href)
                    )
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-gray-200 dark:hover:bg-gray-700"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  <span className="flex-1 text-left">{item.label}</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform",
                      openMenu === item.id && "rotate-180"
                    )}
                  />
                </button>
                {openMenu === item.id && (
                  <ul className="mt-2 ml-4 pl-4 border-l border-gray-300 dark:border-gray-600">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className={cn(
                            "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                            pathname === child.href
                              ? "text-primary"
                              : "text-muted-foreground hover:text-primary"
                          )}
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ) : (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-md px-3 py-3 text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-gray-200 dark:hover:bg-gray-700"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Link>
              </li>
            )
          )}
        </ul>
      </nav>
    </aside>
  );
}
