const { getSummaryData } = require("../services/summaryService.js");
const {
  getMonthlyPerformance,
  getTopProducts,
  getDailyTransactions,
  getRecentActivities,
} = require("../services/dashboardService.js");
const { successResponse, errorResponse } = require("../utils/response.js");

const getSummary = async (req, res) => {
  try {
    const summary = await getSummaryData();
    return successResponse(res, summary, "Summary data retrieved successfully.");
  } catch (error) {
    errorResponse(res, error.message);
  }
};

const getMonthlyPerformanceChart = async (req, res) => {
  try {
    const months = req.query.months ? parseInt(req.query.months) : 6;
    const chartData = await getMonthlyPerformance(months);
    return successResponse(res, chartData, "Monthly performance chart data retrieved successfully.");
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

const getTopProductsChart = async (req, res) => {
  try {
    const topProducts = await getTopProducts();
    return successResponse(res, topProducts,"Top products chart data retrieved successfully.");
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

const getDailyTransactionsChart = async (req, res) => {
  try {
    const dailyTransactions = await getDailyTransactions();
    return successResponse(res, dailyTransactions, "Daily transactions chart data retrieved successfully.");
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

const getRecentActivitiesData = async (req, res) => {
  try {
    const activities = await getRecentActivities();
    return successResponse(res, activities, "Recent activities retrieved successfully.");
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
};
