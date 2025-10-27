const express = require("express");
const router = express.Router();

const {
  getSummary,
  getMonthlyPerformanceChart,
  getTopProductsChart,
  getDailyTransactionsChart,
  getRecentActivitiesData,
} = require("../controllers/dashboardController");

router.get("/summary", getSummary);
router.get("/monthly-performance", getMonthlyPerformanceChart);
router.get("/top-products", getTopProductsChart);
router.get("/daily-transactions", getDailyTransactionsChart);
router.get("/recent-activities", getRecentActivitiesData);

module.exports = router;
