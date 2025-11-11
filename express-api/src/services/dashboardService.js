const prisma = require("../config/prisma");

// Helper function untuk logging query performance
function logQueryPerformance(operation, duration, params = {}) {
  if (duration > 1000) { // Log jika query memakan waktu > 1 detik
    console.log(`[PERFORMANCE] ${operation} took ${duration}ms`, params);
  }
}

// file: src/services/dashboardService.js

const getMonthlyPerformance = async (numberOfMonths = 6) => {
  const now = new Date();
  console.log('MONTHLY PERFORMANCE - Current date/time:', now.toISOString());
  console.log('MONTHLY PERFORMANCE - Number of months requested:', numberOfMonths);
  
  let startDate;

  if (numberOfMonths === 6) {
    // For 6 months performance, exclude current month, go back 6 full months
    startDate = new Date(
      now.getFullYear(),
      now.getMonth() - numberOfMonths, // Go back 6 months, not 5
      1
    );
    console.log('MONTHLY PERFORMANCE - 6-month mode - Start date:', startDate.toISOString());
  } else {
    // For other requests (including 12 months), include current month
    // Go back (numberOfMonths - 1) months from current month
    startDate = new Date(
      now.getFullYear(),
      now.getMonth() - (numberOfMonths - 1),
      1
    );
    console.log('MONTHLY PERFORMANCE - Other mode - Start date:', startDate.toISOString());
  }

  // Set end date based on whether we're excluding current month
  let endDate;
  if (numberOfMonths === 6) {
    // For 6-month requests, exclude current month by ending at the last day of the previous month
    endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999); // Last day of previous month
    console.log('MONTHLY PERFORMANCE - 6-month mode - End date:', endDate.toISOString());
  } else {
    // For other requests (including 12 months), include up to the current moment
    endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999); // Current date at end of day for consistency with summary
    console.log('MONTHLY PERFORMANCE - Other mode - End date:', endDate.toISOString());
  }

  // 2. Gunakan variabel 'startDate' dan 'endDate' sebagai parameter aman di dalam query.
  let result = await prisma.$queryRaw`
    SELECT
      DATE_TRUNC('month', T."createdAt")::DATE AS month,
      SUM(T.total)::float AS revenue,
      COALESCE(SUM(TI.quantity * (TI."sellingPrice" - TI."costPrice")), 0)::float AS profit
    FROM
      "Transaction" AS T
    LEFT JOIN
      "TransactionItem" AS TI ON T.id = TI."transactionId"
    WHERE
      -- Gunakan parameter startDate dan endDate yang sudah dihitung
      T."createdAt" >= ${startDate}
      AND T."createdAt" <= ${endDate}
    GROUP BY
      DATE_TRUNC('month', T."createdAt")::DATE
    ORDER BY
      month ASC;
  `;

  // If this is not a 6-month request (meaning current month might be included) 
  // and if the current month is in the results, we need to make sure it's consistent
  // with the summary service (only up to current time, not full month)
  if (numberOfMonths !== 6) {
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed (0 = January)
    console.log('MONTHLY PERFORMANCE - Checking for current month in results (', currentYear, '-', String(currentMonth + 1).padStart(2, '0'), ')');
    
    // Check if current month exists in results
    const currentMonthIdx = result.findIndex(item => {
      const resultDate = new Date(item.month);
      return resultDate.getFullYear() === currentYear && resultDate.getMonth() === currentMonth;
    });
    
    if (currentMonthIdx > -1) {
      console.log('MONTHLY PERFORMANCE - Current month found in results, recalculating for consistency with summary');
      // Recalculate current month data to match summary service calculation
      // by querying the data exactly as the summary service does
      const startOfThisMonth = new Date(currentYear, currentMonth, 1);
      const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      console.log('MONTHLY PERFORMANCE - Recalculating current month with range:', startOfThisMonth.toISOString(), 'to', endOfToday.toISOString());
      
      const revenueThisMonthResult = await prisma.transaction.aggregate({
        _sum: { total: true },
        where: { 
          createdAt: { 
            gte: startOfThisMonth, 
            lte: endOfToday 
          } 
        },
      });
      
      const profitItemsThisMonth = await prisma.transactionItem.findMany({
        where: {
          transaction: { 
            createdAt: { 
              gte: startOfThisMonth, 
              lte: endOfToday 
            } 
          },
        },
        select: { quantity: true, sellingPrice: true, costPrice: true },
      });

      const profitThisMonth = profitItemsThisMonth.reduce(
        (acc, item) => acc + (item.sellingPrice - item.costPrice) * item.quantity,
        0
      );
      
      console.log('MONTHLY PERFORMANCE - Recalculated revenue:', Number(revenueThisMonthResult._sum.total) || 0);
      console.log('MONTHLY PERFORMANCE - Recalculated profit:', profitThisMonth);
      
      // Update the current month's values in the results
      result[currentMonthIdx].revenue = Number(revenueThisMonthResult._sum.total) || 0;
      result[currentMonthIdx].profit = profitThisMonth;
      console.log('MONTHLY PERFORMANCE - Updated results for current month');
    } else {
      console.log('MONTHLY PERFORMANCE - Current month not found in results');
    }
  } else {
    console.log('MONTHLY PERFORMANCE - 6-month mode, skipping current month processing');
  }

  console.log('MONTHLY PERFORMANCE - Returning results:', result);
  return result;
};

const getTopProducts = async () => {
  const now = new Date();
  console.log('TOP PRODUCTS - Current date/time:', now.toISOString());
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  console.log('TOP PRODUCTS - Month range:', startOfThisMonth.toISOString(), 'to', endOfToday.toISOString());
  
  const topItems = await prisma.transactionItem.groupBy({
    by: ["productId"],
    where: {
      transaction: {
        createdAt: {
          gte: startOfThisMonth,
          lte: endOfToday,
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
    -- 1. Buat deretan tanggal untuk 7 hari ke belakang dari hari ini
    WITH day_series AS (
      SELECT generate_series(
        CURRENT_DATE - INTERVAL '6 days', -- 7 hari termasuk hari ini (6 hari sebelum + hari ini)
        CURRENT_DATE,
        '1 day'::interval
      )::date AS day
    )
    -- 2. Gabungkan dengan data transaksi dan hitung jumlahnya
    SELECT 
      TO_CHAR(ds.day, 'Day') AS day_name, -- 'Monday', 'Tuesday', etc.
      ds.day AS date,
      TO_CHAR(ds.day, 'YYYY-MM-DD') AS formatted_date, -- Tanggal dalam format ISO
      COALESCE(COUNT(T.id), 0)::int AS "transactionCount"
    FROM 
      day_series ds
    LEFT JOIN 
      "Transaction" T ON DATE_TRUNC('day', T."createdAt") = ds.day
    GROUP BY 
      ds.day
    ORDER BY 
      ds.day ASC;
  `;
  return result; // Response: [{ date: '2025-11-10', formatted_date: '2025-11-10', transactionCount: 5 }, ...]
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
