"use client";

import { useMemo } from "react";
import useSWR from "swr";
import { SummaryCard } from "@/components/ui/summary-card";
import { formatCurrency } from "@/lib/utils";
import { fetchSummary } from "@/lib/api";

export function SummarySection() {
  const { data: rawSummary, error } = useSWR("/summary", fetchSummary, {
    refreshInterval: 300000, // Refresh setiap 5 menit
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    errorRetryCount: 2,
    errorRetryInterval: 5000,
    dedupingInterval: 60000, // Prevent duplicate requests dalam 1 menit
  });

  // Normalisasi struktur data summary
  const summary = useMemo(() => {
    if (!rawSummary) return null;
    
    // Cek apakah data berada dalam property 'data' atau langsung berupa objek
    return rawSummary.data || rawSummary;
  }, [rawSummary]);

  // Tampilkan skeleton jika loading
  if (!rawSummary && !error) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard.Skeleton />
        <SummaryCard.Skeleton />
        <SummaryCard.Skeleton />
        <SummaryCard.Skeleton />
      </div>
    );
  }

  // Tampilkan error jika terjadi kesalahan
  if (error) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="text-red-500 text-sm p-2">Error loading data</div>
        <div className="text-red-500 text-sm p-2">Error loading data</div>
        <div className="text-red-500 text-sm p-2">Error loading data</div>
        <div className="text-red-500 text-sm p-2">Error loading data</div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <SummaryCard
        title={summary?.transactionsToday?.title}
        value={summary?.transactionsToday?.value}
        trend={summary?.transactionsToday?.trend}
      />
      <SummaryCard
        title={summary?.productsSoldMonthly?.title}
        value={summary?.productsSoldMonthly?.value}
        trend={summary?.productsSoldMonthly?.trend}
      />
      <SummaryCard
        title={summary?.revenueMonthly?.title}
        value={formatCurrency(summary?.revenueMonthly?.value || 0)}
        trend={summary?.revenueMonthly?.trend}
      />
      <SummaryCard
        title={summary?.profitMonthly?.title}
        value={formatCurrency(summary?.profitMonthly?.value || 0)}
        trend={summary?.profitMonthly?.trend}
      />
    </div>
  );
}