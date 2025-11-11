"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import useSWR from "swr";
import { UserDropdown } from "@/components/auth/UserDropdown";
import { fetchPOSInitialData, preloadPOSData } from "@/lib/api";

// Dynamic imports untuk menerapkan PRPL pattern
// Push: Preload komponen penting
// Render: Tampilkan konten dasar terlebih dahulu
// Pre-cache: Caching komponen untuk akses berikutnya
// Lazy-load: Muat komponen hanya saat diperlukan
const ProductsDataTable = dynamic(
  () => import("./ProductsDataTable").then((mod) => mod.ProductsDataTable),
  {
    loading: () => (
      <div className="flex flex-col h-[calc(100vh-3rem)]">
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-muted rounded mb-4"></div>
            <div className="h-10 w-full bg-muted rounded mb-4"></div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-muted-foreground">Memuat daftar produk...</div>
        </div>
      </div>
    ),
    ssr: false,
  }
);

const TransactionArea = dynamic(
  () => import("./TransactionArea").then((mod) => mod.TransactionArea),
  {
    loading: () => (
      <div className="flex flex-col h-[calc(100vh-3rem)]">
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 w-32 bg-muted rounded mb-2"></div>
            <div className="h-4 w-48 bg-muted rounded mb-4"></div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-muted-foreground">Memuat keranjang...</div>
        </div>
      </div>
    ),
    ssr: false,
  }
);

// Komponen Halaman Utama POS
export default function POSView() {
  // Preload POS data saat komponen dimount
  React.useEffect(() => {
    // Panggil preload untuk mempercepat request
    if (typeof window !== "undefined") {
      preloadPOSData();
    }
  }, []);

  const { data: posData, error: posError } = useSWR(
    "/pos/initial-data",
    fetchPOSInitialData,
    {
      refreshInterval: 0, // Tidak otomatis refresh
      revalidateOnFocus: false,
      dedupingInterval: 60000, // Prevent duplicate requests dalam 1 menit
    }
  );

  if (posError) return <div>Gagal memuat data POS: {posError.message}</div>;

  if (!posData) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-muted rounded mb-6"></div>
        </div>
        <div className="grid grid-cols-20 gap-6 items-start">
          <div className="col-span-13 h-[calc(100vh-3rem)] bg-muted/20 rounded-lg"></div>
          <div className="col-span-7 h-[calc(100vh-3rem)] bg-muted/20 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-20 gap-6 p-6 items-start">
      <div className="col-span-13">
        <ProductsDataTable
          categoriesData={posData.categories}
          posData={posData}
        />
      </div>
      <div className="col-span-7">
        <div className="sticky top-6">
          <TransactionArea />
        </div>
      </div>
    </div>
  );
}
