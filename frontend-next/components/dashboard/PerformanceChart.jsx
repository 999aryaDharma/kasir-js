"use client";

import React, { useMemo, useState } from "react";
import useSWR from "swr";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchMonthlyPerformance } from "@/lib/api";

const PerformanceChart = ({ selectedMonths, onSelectMonths }) => {
  const [localSelectedMonths, setLocalSelectedMonths] = useState(selectedMonths || 6);
  
  const { data: monthlyPerformance, error } = useSWR(
    `/monthly-performance-${localSelectedMonths}`,
    () => fetchMonthlyPerformance(localSelectedMonths),
    {
      refreshInterval: 300000, // Refresh setiap 5 menit
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      errorRetryCount: 2,
      errorRetryInterval: 5000,
      dedupingInterval: 60000, // Prevent duplicate requests dalam 1 menit
    }
  );

  // Format data untuk monthly performance chart
  const chartData = useMemo(() => {
    if (!monthlyPerformance) return [];
    
    // Cek apakah data berada dalam property 'data' atau langsung berupa array
    const performanceData = Array.isArray(monthlyPerformance) 
      ? monthlyPerformance 
      : monthlyPerformance.data || [];
      
    return performanceData?.map((item) => {
      const date = new Date(item.month);
      const monthName = date.toLocaleDateString("id-ID", { month: "short" });
      return {
        month: monthName,
        revenue: item.revenue || 0,
        profit: item.profit || 0,
      };
    }) || [];
  }, [monthlyPerformance]);

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

  return (
    <Card className="lg:col-span-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Performance Overview</CardTitle>
            <div className="text-sm text-muted-foreground">
              Revenue dan Profit {localSelectedMonths} bulan terakhir
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setLocalSelectedMonths(6)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                localSelectedMonths === 6
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              6 Bulan
            </button>
            <button
              onClick={() => setLocalSelectedMonths(12)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                localSelectedMonths === 12
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
                  formatter={(value) => new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR'
                  }).format(value)}
                />
              }
            />
            <Legend />
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
      </CardContent>
    </Card>
  );
};

PerformanceChart.displayName = 'PerformanceChart';

export { PerformanceChart };