"use client";

import React, { useMemo } from "react";
import useSWR from "swr";
import { CartesianGrid, Bar, BarChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchTopProducts } from "@/lib/api";

const TopProductsChart = () => {
  const { data: topProducts, error } = useSWR(
    "/top-products",
    fetchTopProducts,
    {
      refreshInterval: 600000, // Refresh setiap 10 menit
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      errorRetryCount: 2,
      errorRetryInterval: 5000,
      dedupingInterval: 120000, // Prevent duplicate requests dalam 2 menit
    }
  );

  // Format data untuk top products
  const topProductsData = useMemo(() => {
    if (!topProducts) return [];

    // Cek apakah data berada dalam property 'data' atau langsung berupa array
    const productsData = Array.isArray(topProducts)
      ? topProducts
      : topProducts.data || [];

    return (
      productsData?.map((item) => ({
        name: item.productName,
        sales: item.totalSold || 0,
      })) || []
    );
  }, [topProducts]);

  const chartConfig = {
    sales: {
      label: "Terjual",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <Card className="lg:col-span-3">
      <CardHeader>
        <CardTitle>Produk Terlaris</CardTitle>
        <div className="text-sm text-muted-foreground">Top 5 bulan ini</div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
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
            <YAxis dataKey="name" type="category" width={150} fontSize={11} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar
              dataKey="sales"
              fill="var(--color-sales)"
              radius={[0, 8, 8, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

TopProductsChart.displayName = "TopProductsChart";

export { TopProductsChart };
