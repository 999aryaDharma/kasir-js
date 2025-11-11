import dynamic from 'next/dynamic';

// Dynamic import untuk komponen ProductsDataTable karena berisi banyak dependencies berat
export const DynamicProductsDataTable = dynamic(
  () => import('./ProductsDataTable').then(mod => mod.ProductsDataTable),
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
    ssr: false 
  }
);

// Dynamic import untuk komponen TransactionArea
export const DynamicTransactionArea = dynamic(
  () => import('./TransactionArea').then(mod => mod.TransactionArea),
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
    ssr: false 
  }
);