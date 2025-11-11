"use client";

import { useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { SummaryCard } from "@/components/ui/summary-card";
import { PerformanceChartSkeleton } from "@/components/dashboard/PerformanceChartSkeleton";
import { TopProductsChartSkeleton } from "@/components/dashboard/TopProductsChartSkeleton";
import { RecentActivitiesSkeleton } from "@/components/dashboard/RecentActivitiesSkeleton";
import { DailyTransactionsChartSkeleton } from "@/components/dashboard/DailyTransactionsChartSkeleton";

// Dynamic imports for code splitting
const SummarySection = dynamic(
  () =>
    import("@/components/dashboard/SummarySection").then(
      (mod) => mod.SummarySection
    ),
  { ssr: false, loading: () => <SummaryCard.Skeleton count={4} /> }
);
const PerformanceChart = dynamic(
  () =>
    import("@/components/dashboard/PerformanceChart").then(
      (mod) => mod.PerformanceChart
    ),
  { ssr: false, loading: () => <PerformanceChartSkeleton /> }
);
const TopProductsChart = dynamic(
  () =>
    import("@/components/dashboard/TopProductsChart").then(
      (mod) => mod.TopProductsChart
    ),
  { ssr: false, loading: () => <TopProductsChartSkeleton /> }
);
const DailyTransactionsChart = dynamic(
  () =>
    import("@/components/dashboard/DailyTransactionsChart").then(
      (mod) => mod.DailyTransactionsChart
    ),
  {
    ssr: false,
    loading: () => <DailyTransactionsChartSkeleton />,
  }
);
const RecentActivities = dynamic(
  () =>
    import("@/components/dashboard/RecentActivities").then(
      (mod) => mod.RecentActivities
    ),
  {
    ssr: false,
    loading: () => <RecentActivitiesSkeleton />,
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
        <Suspense fallback={<PerformanceChartSkeleton />}>
          <PerformanceChart
            selectedMonths={selectedMonths}
            onSelectMonths={setSelectedMonths}
          />
        </Suspense>
        <Suspense fallback={<TopProductsChartSkeleton />}>
          <TopProductsChart />
        </Suspense>
      </div>

      {/* Daily Transactions & Recent Activities */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Suspense fallback={<DailyTransactionsChartSkeleton />}>
          <DailyTransactionsChart />
        </Suspense>
        <Suspense fallback={<RecentActivitiesSkeleton />}>
          <RecentActivities />
        </Suspense>
      </div>
    </div>
  );
}
