const { getSummaryData } = require("../services/summaryService.js");
const {
  getMonthlyPerformance,
  getTopProducts,
  getDailyTransactions,
  getRecentActivities,
} = require("../services/dashboardService.js");
const { successResponse, errorResponse } = require("../utils/response.js");
const cache = require("../utils/cache.js");

const getSummary = async (req, res) => {
  try {
    const cacheKey = 'summary';
    
    // Cek apakah data sudah ada di cache
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log(`Cache hit for key: ${cacheKey}`);
      return successResponse(res, cachedData, "Summary data retrieved from cache");
    }
    
    console.log(`Cache miss for key: ${cacheKey}, fetching fresh data`);
    
    const summary = await getSummaryData();
    
    // Simpan ke cache selama 5 menit (300 detik)
    cache.set(cacheKey, summary, 300);
    console.log(`Data cached for key: ${cacheKey}`);

    return successResponse(res, summary, "Summary data retrieved successfully.");
  } catch (error) {
    errorResponse(res, error.message);
  }
};

const getMonthlyPerformanceChart = async (req, res) => {
  try {
    const months = req.query.months ? parseInt(req.query.months) : 6;
    const cacheKey = `monthly_performance_${months}`;
    
    // Cek apakah data sudah ada di cache
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log(`Cache hit for key: ${cacheKey}`);
      return successResponse(res, cachedData, "Monthly performance data retrieved from cache");
    }
    
    console.log(`Cache miss for key: ${cacheKey}, fetching fresh data`);
    
    const chartData = await getMonthlyPerformance(months);
    
    // Simpan ke cache selama 5 menit (300 detik)
    cache.set(cacheKey, chartData, 300);
    console.log(`Data cached for key: ${cacheKey}`);

    return successResponse(res, chartData, "Monthly performance chart data retrieved successfully.");
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

const getTopProductsChart = async (req, res) => {
  try {
    const cacheKey = 'top_products';
    
    // Cek apakah data sudah ada di cache
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log(`Cache hit for key: ${cacheKey}`);
      return successResponse(res, cachedData, "Top products data retrieved from cache");
    }
    
    console.log(`Cache miss for key: ${cacheKey}, fetching fresh data`);
    
    const topProducts = await getTopProducts();
    
    // Simpan ke cache selama 5 menit (300 detik)
    cache.set(cacheKey, topProducts, 300);
    console.log(`Data cached for key: ${cacheKey}`);

    return successResponse(res, topProducts,"Top products chart data retrieved successfully.");
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

const getDailyTransactionsChart = async (req, res) => {
  try {
    const cacheKey = 'daily_transactions';
    
    // Cek apakah data sudah ada di cache
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log(`Cache hit for key: ${cacheKey}`);
      return successResponse(res, cachedData, "Daily transactions data retrieved from cache");
    }
    
    console.log(`Cache miss for key: ${cacheKey}, fetching fresh data`);
    
    const dailyTransactions = await getDailyTransactions();
    
    // Simpan ke cache selama 5 menit (300 detik)
    cache.set(cacheKey, dailyTransactions, 300);
    console.log(`Data cached for key: ${cacheKey}`);

    return successResponse(res, dailyTransactions, "Daily transactions chart data retrieved successfully.");
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

const getRecentActivitiesData = async (req, res) => {
  try {
    const cacheKey = 'recent_activities';
    
    // Cek apakah data sudah ada di cache
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log(`Cache hit for key: ${cacheKey}`);
      return successResponse(res, cachedData, "Recent activities data retrieved from cache");
    }
    
    console.log(`Cache miss for key: ${cacheKey}, fetching fresh data`);
    
    const activities = await getRecentActivities();
    
    // Simpan ke cache selama 2 menit (120 detik) karena ini data yang lebih dinamis
    cache.set(cacheKey, activities, 120);
    console.log(`Data cached for key: ${cacheKey}`);

    return successResponse(res, activities, "Recent activities retrieved successfully.");
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

// Fungsi untuk menggabungkan semua data dashboard dalam satu request
const getDashboard = async (req, res) => {
  try {
    const months = req.query.months ? parseInt(req.query.months) : 6;
    
    // Buat cache key berdasarkan parameter
    const cacheKey = `dashboard_${months}`;
    
    // Cek apakah data sudah ada di cache
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log(`Cache hit for key: ${cacheKey}`);
      return successResponse(res, cachedData, "Dashboard data retrieved from cache");
    }
    
    console.log(`Cache miss for key: ${cacheKey}, fetching fresh data`);
    
    // Jalankan semua permintaan secara paralel untuk efisiensi
    const [
      summary,
      monthlyPerformance,
      topProducts,
      dailyTransactions,
      recentActivities
    ] = await Promise.all([
      getSummaryData(),
      getMonthlyPerformance(months),
      getTopProducts(),
      getDailyTransactions(),
      getRecentActivities()
    ]);

    const dashboardData = {
      summary,
      monthlyPerformance,
      topProducts,
      dailyTransactions,
      recentActivities
    };

    // Simpan ke cache selama 5 menit (300 detik)
    cache.set(cacheKey, dashboardData, 300);
    console.log(`Data cached for key: ${cacheKey}`);

    return successResponse(res, dashboardData, "Dashboard data retrieved successfully.");
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

module.exports = {
  getSummary,
  getMonthlyPerformanceChart,
  getTopProductsChart,
  getDailyTransactionsChart,
  getRecentActivitiesData,
  getDashboard,
};
