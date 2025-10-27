"use client";

import { useState } from "react";
import useSWR from "swr";
import {
  fetchSummary,
  fetchMonthlyPerformance,
  fetchTopProducts,
  fetchDailyTransactions,
  fetchRecentActivities,
} from "@/lib/api";
import { formatCurrency, formatTimeAgo } from "@/lib/utils";
import { SummaryCard } from "@/components/ui/summary-card";
import { AlertCircle, TrendingUp, CheckCircle, Plus } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Bar,
  BarChart,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export default function DashboardPage() {
  const [selectedMonths, setSelectedMonths] = useState(6);

  const { data: summary, error } = useSWR("/summary", fetchSummary);
  const { data: monthlyPerformance, error: monthlyError } = useSWR(
    `/monthly-performance-${selectedMonths}`,
    () => fetchMonthlyPerformance(selectedMonths)
  );
  const { data: topProducts } = useSWR("/top-products", fetchTopProducts);
  const { data: dailyTransactions } = useSWR(
    "/daily-transactions",
    fetchDailyTransactions
  );
  const { data: recentActivities } = useSWR(
    "/recent-activities",
    fetchRecentActivities
  );

  const chartConfig = {
    revenue: {
      label: "Pendapatan",
      color: "#fb923c", // orange-500
    },
    profit: {
      label: "Profit",
      color: "#a3e635", // lime-400
    },
  };

  const topProductsConfig = {
    sales: {
      label: "Terjual",
      color: "#fb923c", // orange-500
    },
  };

  const dailyTransactionsConfig = {
    count: {
      label: "Transaksi",
      color: "#a3e635", // lime-400
    },
  };

  // Format data untuk monthly performance chart
  const chartData =
    monthlyPerformance?.data?.map((item) => {
      const date = new Date(item.month);
      const monthName = date.toLocaleDateString("id-ID", { month: "short" });
      return {
        month: monthName,
        revenue: item.revenue || 0,
        profit: item.profit || 0,
      };
    }) || [];

  // Format data untuk top products
  const topProductsData =
    topProducts?.map((item) => ({
      name: item.productName,
      sales: item.totalSold || 0,
    })) || [];

  // Format data untuk daily transactions
  const dailyTransactionsData =
    dailyTransactions?.map((item) => {
      const date = new Date(item.date);
      const dayName = date.toLocaleDateString("id-ID", { weekday: "short" });
      return {
        day: dayName,
        count: item.transactionCount || 0,
      };
    }) || [];

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

      {/* Chart Overview */}
      <div className="mt-6 grid gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Performance Overview</CardTitle>
                <CardDescription>
                  Revenue dan Profit {selectedMonths} bulan terakhir
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedMonths(6)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedMonths === 6
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  6 Bulan
                </button>
                <button
                  onClick={() => setSelectedMonths(12)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedMonths === 12
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  12 Bulan
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {monthlyError ? (
              <div className="flex items-center justify-center h-64 text-red-500">
                <AlertCircle className="mr-2 h-5 w-5" />
                <span>Gagal memuat data chart</span>
              </div>
            ) : !monthlyPerformance ? (
              <div className="flex items-center justify-center h-64">
                <span className="text-muted-foreground">Loading chart...</span>
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <LineChart
                  data={chartData}
                  margin={{
                    left: -20,
                    right: 12,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    fontSize={12}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    tickFormatter={(value) =>
                      `${(value / 1000000).toFixed(0)}M`
                    }
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value) => formatCurrency(value)}
                      />
                    }
                  />
                      <Legend margin={{ top: 8 }} />
                  <Line
                    dataKey="revenue"
                    type="monotone"
                    stroke="var(--color-revenue)"
                    strokeWidth={2}
                    dot={{ fill: "var(--color-revenue)" }}
                    name={chartConfig.revenue.label}
                  />
                  <Line
                    dataKey="profit"
                    type="monotone"
                    stroke="var(--color-profit)"
                    strokeWidth={2}
                    dot={{ fill: "var(--color-profit)" }}
                    name={chartConfig.profit.label}
                  />
                </LineChart>
              </ChartContainer>
            )}
          </CardContent>
          {/* <CardFooter>
            <div className="flex w-full items-start gap-2 text-sm">
              <div className="grid gap-2">
                <div className="flex items-center gap-2 leading-none text-muted-foreground">
                  Menampilkan performa {selectedMonths} bulan terakhir
                </div>
              </div>
            </div>
          </CardFooter> */}
        </Card>

        {/* Top Products Chart */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Produk Terlaris</CardTitle>
            <CardDescription>Top 5 bulan ini</CardDescription>
          </CardHeader>
          <CardContent>
            {!topProducts ? (
              <div className="flex items-center justify-center h-64">
                <span className="text-muted-foreground">Loading...</span>
              </div>
            ) : (
              <ChartContainer
                config={topProductsConfig}
                className="h-[300px] w-full"
              >
                <BarChart
                  data={topProductsData}
                  layout="vertical"
                  margin={{
                    left: -50,
                    right: 20,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" fontSize={12} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={150}
                    fontSize={11}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />
                  <Bar
                    dataKey="sales"
                    fill="var(--color-sales)"
                    radius={[0, 8, 8, 0]}
                  />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Daily Transactions & Recent Activities */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Transaksi Harian</CardTitle>
            <CardDescription>Minggu ini</CardDescription>
          </CardHeader>
          <CardContent>
            {!dailyTransactions ? (
              <div className="flex items-center justify-center h-64">
                <span className="text-muted-foreground">Loading...</span>
              </div>
            ) : (
              <ChartContainer
                config={dailyTransactionsConfig}
                className="h-[250px] w-full"
              >
                <BarChart data={dailyTransactionsData} margin={{ left: -20, right: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" fontSize={12} />
                  <YAxis fontSize={12} />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />
                  <Bar
                    dataKey="count"
                    fill="var(--color-count)"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
            <CardDescription>Update terkini</CardDescription>
          </CardHeader>
          <CardContent>
            {!recentActivities ? (
              <div className="flex items-center justify-center h-64">
                <span className="text-muted-foreground">Loading...</span>
              </div>
            ) : (
              <div className="space-y-3 max-h-[250px] overflow-y-auto">
                {recentActivities
                  .filter((activity) => {
                    // Filter: hanya tampilkan aktivitas yang timestampnya <= sekarang (client timezone)
                    const activityTime = new Date(activity.time);
                    const now = new Date();
                    return activityTime <= now;
                  })
                  .map((activity, index) => (
                    <ActivityItem
                      key={index}
                      icon={activity.icon}
                      title={activity.title}
                      description={activity.description}
                      time={activity.time}
                      iconBgColor={activity.iconBgColor}
                    />
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Activity Item Component
function ActivityItem({ icon, title, description, time, iconBgColor }) {
  const IconComponent = {
    CheckCircle,
    AlertCircle,
    Plus,
  }[icon];

  const bgColorClass = {
    success: "bg-lime-400/10 text-lime-400",
    warning: "bg-orange-500/10 text-orange-500",
    primary: "bg-primary/10 text-primary",
  }[iconBgColor];

  // Format time di client side dengan timezone client
  const formattedTime = formatTimeAgo(time);

  return (
    <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
      <div className={`p-2 rounded-full ${bgColorClass}`}>
        {IconComponent && <IconComponent className="h-4 w-4" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-none mb-1">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <span className="text-xs text-muted-foreground whitespace-nowrap">
        {formattedTime}
      </span>
    </div>
  );
}
