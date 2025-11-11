"use client";

import { useState, Suspense, useEffect } from "react";
import dynamic from "next/dynamic";
import { SummaryCard } from "@/components/ui/summary-card";
import { AlertCircle } from "lucide-react";
import { preloadDashboardData } from "@/lib/preload";

// Preload dashboard data saat komponen dimount
if (typeof window !== 'undefined') {
  preloadDashboardData(6);
}

// Skeleton component for charts, defined at the module level
const ChartSkeleton = () => (
  <div className="h-[366px] w-full bg-muted/50 animate-pulse rounded-lg" />
);

// Dynamic imports for code splitting
const SummarySection = dynamic(
  () =>
    import("@/components/dashboard/SummarySection").then((mod) => mod.SummarySection),
  { ssr: false, loading: () => <SummaryCard.Skeleton count={4} /> }
);
const PerformanceChart = dynamic(
  () =>
    import("@/components/dashboard/PerformanceChart").then(
      (mod) => mod.PerformanceChart
    ),
  { ssr: false, loading: () => <ChartSkeleton /> }
);
const TopProductsChart = dynamic(
  () =>
    import("@/components/dashboard/TopProductsChart").then(
      (mod) => mod.TopProductsChart
    ),
  { ssr: false, loading: () => <ChartSkeleton /> }
);
const DailyTransactionsChart = dynamic(
  () =>
    import("@/components/dashboard/DailyTransactionsChart").then(
      (mod) => mod.DailyTransactionsChart
    ),
  { ssr: false, loading: () => <ChartSkeleton /> }
);
const RecentActivities = dynamic(
  () =>
    import("@/components/dashboard/RecentActivities").then(
      (mod) => mod.RecentActivities
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[314px] w-full bg-muted/50 animate-pulse rounded-lg" />
    ),
  }
);

export default function DashboardPage() {
  const [selectedMonths, setSelectedMonths] = useState(6);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {/* Summary Section */}
      <Suspense
        fallback={
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <SummaryCard.Skeleton />
            <SummaryCard.Skeleton />
            <SummaryCard.Skeleton />
            <SummaryCard.Skeleton />
          </div>
        }
      >
        <SummarySection />
      </Suspense>

      {/* Chart Overview */}
      <div className="mt-6 grid gap-4 lg:grid-cols-7">
        <Suspense fallback={<ChartSkeleton />}>
          <PerformanceChart selectedMonths={selectedMonths} onSelectMonths={setSelectedMonths} />
        </Suspense>
        <Suspense fallback={<ChartSkeleton />}>
          <TopProductsChart />
        </Suspense>
      </div>

      {/* Daily Transactions & Recent Activities */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Suspense fallback={<ChartSkeleton />}>
          <DailyTransactionsChart />
        </Suspense>
        <Suspense fallback={
          <div className="h-[314px] w-full bg-muted/50 animate-pulse rounded-lg" />
        }>
          <RecentActivities />
        </Suspense>
      </div>
    </div>
  );
}
