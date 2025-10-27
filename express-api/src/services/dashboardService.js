const prisma = require("../config/prisma");

// file: src/services/dashboardService.js

const getMonthlyPerformance = async (numberOfMonths = 6) => {
  const now = new Date();

  // Untuk mendapatkan 6 bulan (termasuk bulan ini), kita mundur 5 bulan dari sekarang,
  // lalu ambil tanggal 1 dari bulan tersebut.
  // Contoh: Oktober (bulan ke-9) - 5 = bulan ke-4 (Mei). Tanggal 1 Mei.
  const startDate = new Date(
    now.getFullYear(),
    now.getMonth() - (numberOfMonths - 1),
    1
  );

  const currentDate = new Date();

  // 2. Gunakan variabel 'startDate' sebagai parameter aman di dalam query.
  const result = await prisma.$queryRaw`
    SELECT
      DATE_TRUNC('month', T."createdAt")::DATE AS month,
      SUM(T.total)::float AS revenue,
      COALESCE(SUM(TI.quantity * (TI."sellingPrice" - TI."costPrice")), 0)::float AS profit
    FROM
      "Transaction" AS T
    LEFT JOIN
      "TransactionItem" AS TI ON T.id = TI."transactionId"
    WHERE
      -- Gunakan parameter startDate yang sudah dihitung
      T."createdAt" >= ${startDate}
      AND T."createdAt" <= NOW()
    GROUP BY
      month
    ORDER BY
      month ASC;
  `;

  return result;
};

const getTopProducts = async () => {
  const topItems = await prisma.transactionItem.groupBy({
    by: ["productId"],
    where: {
      transaction: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    },
    _sum: {
      quantity: true,
    },
    orderBy: {
      _sum: {
        quantity: "desc",
      },
    },
    take: 5,
  });

  // Ambil detail nama produknya
  const productIds = topItems.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true },
  });

  // Gabungkan hasilnya
  return topItems.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return {
      productName: product ? product.name : "Unknown",
      totalSold: item._sum.quantity,
    };
  });
};

const getDailyTransactions = async () => {
  const result = await prisma.$queryRaw`
    -- 1. Buat deretan tanggal untuk 7 hari dalam seminggu (Senin-Minggu)
    --    berdasarkan tanggal HARI INI.
    WITH week_series AS (
      SELECT generate_series(
        DATE_TRUNC('week', NOW())::date,
        DATE_TRUNC('week', NOW())::date + INTERVAL '6 days',
        '1 day'::interval
      )::date AS day
    )
    -- 2. Gabungkan dengan data transaksi dan hitung jumlahnya
    SELECT 
      TO_CHAR(ws.day, 'Day') AS day_name, -- 'Monday', 'Tuesday', etc.
      ws.day AS date,
      COALESCE(COUNT(T.id), 0)::int AS "transactionCount"
    FROM 
      week_series ws
    LEFT JOIN 
      "Transaction" T ON DATE_TRUNC('day', T."createdAt") = ws.day
    GROUP BY 
      ws.day
    ORDER BY 
      ws.day ASC;
  `;
  return result; // Response: [{ date: '2025-10-16', transactioncount: 25 }, ...]
};

const getRecentActivities = async (clientTimezone = "Asia/Makassar") => {
  // Query 24 jam terakhir untuk handle timezone client
  // Ambil data 24 jam terakhir dari sekarang (UTC) untuk memastikan semua data hari ini client masuk
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const [recentTransactions, lowStockProducts, recentProducts] =
    await Promise.all([
      // Transaksi 24 jam terakhir (ini akan cover timezone client)
      prisma.transaction.findMany({
        where: {
          createdAt: {
            gte: twentyFourHoursAgo,
            lte: now,
          },
        },
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          total: true,
          createdAt: true,
        },
      }),

      // Produk dengan stok menipis (stok <= 10)
      prisma.product.findMany({
        where: {
          stock: {
            lte: 10,
          },
        },
        take: 3,
        orderBy: { stock: "asc" },
        select: {
          id: true,
          name: true,
          stock: true,
          updatedAt: true,
        },
      }),

      // Produk baru ditambahkan 24 jam terakhir
      prisma.product.findMany({
        where: {
          createdAt: {
            gte: twentyFourHoursAgo,
            lte: now,
          },
        },
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          createdAt: true,
        },
      }),
    ]);

  // Format activities
  const activities = [];

  // Add transactions
  recentTransactions.forEach((transaction) => {
    // Konversi id ke string dulu sebelum slice
    const orderId = String(transaction.id).slice(0, 8).toUpperCase();
    activities.push({
      type: "transaction",
      icon: "CheckCircle",
      title: `Order #${orderId}`,
      description: `Total ${formatRupiah(
        transaction.total
      )} - Pembayaran berhasil`,
      time: transaction.createdAt,
      iconBgColor: "success",
    });
  });

  // Add low stock alerts
  lowStockProducts.forEach((product) => {
    activities.push({
      type: "low_stock",
      icon: "AlertCircle",
      title: "Stok Menipis",
      description: `${product.name} tersisa ${product.stock} unit`,
      time: product.updatedAt,
      iconBgColor: "warning",
    });
  });

  // Add new products (sudah difilter hari ini di query)
  recentProducts.forEach((product) => {
    activities.push({
      type: "new_product",
      icon: "Plus",
      title: "Produk Baru",
      description: `${product.name} ditambahkan`,
      time: product.createdAt,
      iconBgColor: "primary",
    });
  });

  // Sort by time descending dan ambil 10 terbaru
  // Kirim timestamp mentah, biarkan frontend yang format sesuai timezone client
  return activities
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .slice(0, 10);
};

// Helper function untuk format rupiah
function formatRupiah(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

// formatTimeAgo dipindahkan ke frontend untuk akurasi timezone client

module.exports = {
  getMonthlyPerformance,
  getTopProducts,
  getDailyTransactions,
  getRecentActivities,
};
