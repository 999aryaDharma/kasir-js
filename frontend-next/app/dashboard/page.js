"use client";

import useSWR from "swr";
import { fetchSummary } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { SummaryCard } from "@/components/ui/summary-card";
import { AlertCircle } from "lucide-react";

export default function DashboardPage() {
  const { data: summary, error } = useSWR("/summary", fetchSummary);

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-red-50 border border-red-200 rounded-lg">
        <div className="text-center text-red-700">
          <AlertCircle className="mx-auto h-12 w-12" />
          <h2 className="mt-4 text-xl font-semibold">Gagal Memuat Data</h2>
          <p className="mt-2 text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  // Gabungkan pengecekan loading state. Tampilkan skeleton jika data belum siap.
  if (!summary) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <SummaryCard.Skeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title={summary.transactionsToday?.title}
          value={summary.transactionsToday?.value}
          trend={summary.transactionsToday?.trend}
        />
        <SummaryCard
          title={summary.productsSoldMonthly?.title}
          value={summary.productsSoldMonthly?.value}
          trend={summary.productsSoldMonthly?.trend}
        />
        <SummaryCard
          title={summary.revenueMonthly?.title}
          value={formatCurrency(summary.revenueMonthly?.value || 0)}
          trend={summary.revenueMonthly?.trend}
        />
        <SummaryCard
          title={summary.profitMonthly?.title}
          value={formatCurrency(summary.profitMonthly?.value || 0)}
          trend={summary.profitMonthly?.trend}
        />
      </div>
    </div>
  );
}
