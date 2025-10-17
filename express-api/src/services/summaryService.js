// file: src/services/dashboardService.js

const prisma = require("../config/prisma");

// Helper untuk menghitung tren
function calculateTrend(current, previous) {
  if (previous === 0 || previous === null) return current > 0 ? 100 : 0;
  const change = ((current - previous) / previous) * 100;
  return parseFloat(change.toFixed(1));
}

const getSummaryData = async () => {
  // 1. Definisikan rentang waktu
  const now = new Date(); // Tanggal dan waktu saat ini
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  // Rentang untuk kemarin
  const startOfYesterday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 1
  );
  const endOfYesterday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 1,
    23,
    59,
    59,
    999
  );

  // Rentang untuk NILAI TAMPILAN (awal bulan ini s/d sekarang)
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfToday = new Date(now.setHours(23, 59, 59, 999)); // Batas atas adalah akhir hari ini

  // Rentang untuk PERHITUNGAN TREN (periode yang sama di bulan lalu)
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfEquivalentDayLastMonth = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    now.getDate(),
    now.getHours(),
    now.getMinutes(),
    now.getSeconds(),
    now.getMilliseconds()
  );

  // 2. Jalankan semua query secara paralel
  const [
    transactionsToday,
    transactionsYesterday,
    revenueThisMonthResult,
    revenueLastMonthResult,
    soldThisMonthResult,
    soldLastMonthResult,
    profitItemsThisMonth,
    profitItemsLastMonth,
  ] = await Promise.all([
    // Total Transaksi Hari Ini
    prisma.transaction.count({
      where: { createdAt: { gte: startOfToday, lte: endOfToday } }, // Awal hari ini -> sekarang
    }),
    // Total Transaksi Kemarin
    prisma.transaction.count({
      where: { createdAt: { gte: startOfYesterday, lte: endOfYesterday } },
    }),

    // Pendapatan Bulan Ini
    prisma.transaction.aggregate({
      _sum: { total: true },
      where: { createdAt: { gte: startOfThisMonth, lte: endOfToday } }, // Awal bulan ini -> sekarang
    }),
    // Pendapatan Bulan Lalu (untuk tren)
    prisma.transaction.aggregate({
      _sum: { total: true },
      where: {
        createdAt: { gte: startOfLastMonth, lte: endOfEquivalentDayLastMonth },
      }, // Periode yang sama bulan lalu
    }),
    // Produk Terjual Bulan Ini
    prisma.transactionItem.aggregate({
      _sum: { quantity: true },
      where: {
        transaction: { createdAt: { gte: startOfThisMonth, lte: endOfToday } },
      },
    }),
    // Produk Terjual Bulan Lalu (untuk tren)
    prisma.transactionItem.aggregate({
      _sum: { quantity: true },
      where: {
        transaction: {
          createdAt: {
            gte: startOfLastMonth,
            lte: endOfEquivalentDayLastMonth,
          },
        },
      },
    }),
    // Item untuk kalkulasi Profit Bulan Ini
    prisma.transactionItem.findMany({
      where: { createdAt: { gte: startOfThisMonth, lte: endOfToday } },
      select: { quantity: true, sellingPrice: true, costPrice: true },
    }),
    // Item untuk kalkulasi Profit Bulan Lalu (untuk tren)
    prisma.transactionItem.findMany({
      where: { createdAt: { gte: startOfLastMonth, lt: startOfThisMonth } },
      select: { quantity: true, sellingPrice: true, costPrice: true },
    }),
  ]);

  // 3. Olah data mentah menjadi nilai akhir
  const revenueThisMonth = revenueThisMonthResult._sum.total || 0;
  const revenueLastMonth = revenueLastMonthResult._sum.total || 0;
  const soldThisMonth = soldThisMonthResult._sum.quantity || 0;
  const soldLastMonth = soldLastMonthResult._sum.quantity || 0;

  const profitThisMonth = profitItemsThisMonth.reduce(
    (acc, item) => acc + (item.sellingPrice - item.costPrice) * item.quantity,
    0
  );
  const profitLastMonth = profitItemsLastMonth.reduce(
    (acc, item) => acc + (item.sellingPrice - item.costPrice) * item.quantity,
    0
  );

  // 4. Susun JSON response
  return {
    transactionsToday: {
      title: "Transaksi Hari Ini",
      value: transactionsToday,
      trend: {
        value: calculateTrend(transactionsToday, transactionsYesterday),
        isPositive: transactionsToday >= transactionsYesterday,
      },
    },
    revenueMonthly: {
      title: "Pendapatan Bulan Ini",
      value: revenueThisMonth,
      trend: {
        value: calculateTrend(revenueThisMonth, revenueLastMonth),
        isPositive: revenueThisMonth >= revenueLastMonth,
      },
    },
    productsSoldMonthly: {
      title: "Produk Terjual Bulan Ini",
      value: soldThisMonth,
      trend: {
        value: calculateTrend(soldThisMonth, soldLastMonth),
        isPositive: soldThisMonth >= soldLastMonth,
      },
    },
    profitMonthly: {
      title: "Profit Bulan Ini",
      value: profitThisMonth,
      trend: {
        value: calculateTrend(profitThisMonth, profitLastMonth),
        isPositive: profitThisMonth >= profitLastMonth,
      },
    },
  };
};

module.exports = {
  getSummaryData,
};
