const prisma = require("../config/prisma");

// Helper untuk menghitung tren
function calculateTrend(current, previous) {
  if (previous === 0 || previous === null) return current > 0 ? 100 : 0;
  const change = ((current - previous) / previous) * 100;
  return parseFloat(change.toFixed(1));
}

const getSummaryData = async () => {
  // 1. Definisikan rentang waktu
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const endOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
    999
  );

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

  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfEquivalentDayLastMonth = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    now.getDate(),
    23,
    59,
    59,
    999
  );

  // 2. Jalankan semua query dalam satu transaksi database
  const [transactionsToday, transactionsYesterday, monthlyData] =
    await prisma.$transaction([
      prisma.transaction.count({
        where: { createdAt: { gte: startOfToday, lte: endOfToday } },
      }),
      prisma.transaction.count({
        where: { createdAt: { gte: startOfYesterday, lte: endOfYesterday } },
      }),
      prisma.$queryRaw`
      SELECT
        COALESCE(SUM(CASE WHEN t."createdAt" >= ${startOfThisMonth} THEN t.total ELSE 0 END), 0) AS "revenueThisMonth", -- Pendapatan Bulan Ini
        COALESCE(SUM(CASE WHEN t."createdAt" >= ${startOfLastMonth} AND t."createdAt" <= ${endOfEquivalentDayLastMonth} THEN t.total ELSE 0 END), 0) AS "revenueLastMonth", -- Pendapatan Bulan Lalu
        COALESCE(SUM(CASE WHEN t."createdAt" >= ${startOfThisMonth} THEN ti.quantity ELSE 0 END), 0) AS "soldThisMonth", -- Produk Terjual Bulan Ini
        COALESCE(SUM(CASE WHEN t."createdAt" >= ${startOfLastMonth} AND t."createdAt" <= ${endOfEquivalentDayLastMonth} THEN ti.quantity ELSE 0 END), 0) AS "soldLastMonth", -- Produk Terjual Bulan Lalu
        COALESCE(SUM(CASE WHEN t."createdAt" >= ${startOfThisMonth} THEN (ti."sellingPrice" - ti."costPrice") * ti.quantity ELSE 0 END), 0) AS "profitThisMonth", -- Profit Bulan Ini
        COALESCE(SUM(CASE WHEN t."createdAt" >= ${startOfLastMonth} AND t."createdAt" <= ${endOfEquivalentDayLastMonth} THEN (ti."sellingPrice" - ti."costPrice") * ti.quantity ELSE 0 END), 0) AS "profitLastMonth" -- Profit Bulan Lalu
      FROM "Transaction" t
      LEFT JOIN "TransactionItem" ti ON t.id = ti."transactionId"
      WHERE t."createdAt" >= ${startOfLastMonth} AND t."createdAt" <= ${endOfToday}
    `,
    ]);

  // 3. Olah data mentah menjadi nilai akhir
  const data = monthlyData[0];
  const revenueThisMonth = Number(data.revenueThisMonth);
  const revenueLastMonth = Number(data.revenueLastMonth);
  const soldThisMonth = Number(data.soldThisMonth);
  const soldLastMonth = Number(data.soldLastMonth);
  const profitThisMonth = Number(data.profitThisMonth);
  const profitLastMonth = Number(data.profitLastMonth);

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
