"use client";

import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchSummary } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

export default function DashboardPage() {
	// Pindahkan hook SWR ke dalam komponen
	const { data: summary, error } = useSWR("/summary", fetchSummary);

	if (error) return <div>Gagal memuat data ringkasan.</div>;
	if (!summary) return <div>Memuat...</div>;

	return (
		<div>
			<h1 className="text-3xl font-bold mb-6">Dashboard</h1>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Produk</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{summary.totalProducts}</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Kategori</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{summary.totalCategories}</div>
					</CardContent>
				</Card>
				{/* Tambahkan card lainnya di sini */}
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{formatCurrency(summary.totalRevenueMonthly)}</div>
						<p className="text-xs text-muted-foreground">+20.1% dari bulan lalu</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{formatCurrency(summary.totalProfitMonthly)}</div>
						<p className="text-xs text-muted-foreground">+20.1% dari bulan lalu</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
