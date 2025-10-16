"use client";

import useSWR from "swr";
import { fetchSummary } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { SummaryCard } from "@/components/ui/summary-card";


export default function DashboardPage() {
  // Pindahkan hook SWR ke dalam komponen
  const { data: summaryResponse, error } = useSWR("/summary", fetchSummary);

  if (error) return <div>Gagal memuat data ringkasan.</div>;
  if (!summaryResponse) return <div>Memuat...</div>;

  // Ambil data dari response, baik langsung maupun dari property data
  const summary = summaryResponse.data || summaryResponse;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard title="Total Produk" value={summary.totalProducts} />
        <SummaryCard title="Total Kategori" value={summary.totalCategories} />
        <SummaryCard
          title="Total Pendapatan 1 Bulan"
          value={formatCurrency(summary.totalRevenueMonthly)}
          footerText="+20.1% dari bulan lalu"
        />
        <SummaryCard
          title="Total Profit 1 Bulan"
          value={formatCurrency(summary.totalProfitMonthly)}
          footerText="+20.1% dari bulan lalu"
        />
      </div>
    </div>
  );
}
