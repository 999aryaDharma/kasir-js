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
import { fetchDailyTransactions } from "@/lib/api";

const DailyTransactionsChart = () => {
  const { data: dailyTransactions, error } = useSWR(
    "/daily-transactions",
    fetchDailyTransactions,
    {
      refreshInterval: 300000, // Refresh setiap 5 menit
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      errorRetryCount: 2,
      errorRetryInterval: 5000,
      dedupingInterval: 60000, // Prevent duplicate requests dalam 1 menit
    }
  );

  // Format data untuk daily transactions
  const dailyTransactionsData = useMemo(() => {
    if (!dailyTransactions) return [];
    
    // Cek apakah data berada dalam property 'data' atau langsung berupa array
    const transactionsData = Array.isArray(dailyTransactions) 
      ? dailyTransactions 
      : dailyTransactions.data || [];
      
    return transactionsData?.map((item) => {
      const date = new Date(item.date);
      const dayName = date.toLocaleDateString("id-ID", { weekday: "short" });
      return {
        name: dayName, // Ubah dari 'day' ke 'name' agar konsisten dengan konvensi Recharts
        date: item.formatted_date, // Tambahkan tanggal dalam format ISO
        shortDate: date.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
        }), // Tambahkan tanggal pendek
        count: item.transactionCount || 0,
      };
    }) || [];
  }, [dailyTransactions]);

  const chartConfig = {
    count: {
      label: "Transaksi",
      color: "#a3e635", // lime-400
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaksi Harian</CardTitle>
        <div className="text-sm text-muted-foreground">7 hari terakhir</div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart
            data={dailyTransactionsData}
            margin={{ left: -20, right: 12 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" fontSize={12} />
            <YAxis fontSize={12} />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    // Cari data yang sesuai dengan label (name) dan tampilkan tanggal lengkap
                    const foundData = dailyTransactionsData.find(
                      (d) => d.name === value
                    );
                    if (foundData && foundData.date) {
                      const fullDate = new Date(
                        foundData.date
                      ).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      });
                      return `${value}, ${fullDate}`;
                    }
                    return value;
                  }}
                />
              }
            />
            <Bar
              dataKey="count"
              fill="var(--color-count)"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

DailyTransactionsChart.displayName = "DailyTransactionsChart";

export { DailyTransactionsChart };
