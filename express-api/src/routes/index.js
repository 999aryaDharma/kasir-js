const express = require("express");
const router = express.Router();

const categoryRoutes = require("./categoryRoutes");
const productRoutes = require("./productRoutes");
const summaryRoutes = require("./dashboardRoutes");
const authRoutes = require("./authRoutes");
const transactionRoutes = require("./transactionRoutes");
const posRoutes = require("./posRoutes");
const authMiddleware = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/authorizeMiddleware");

// Rute yang tidak memerlukan otentikasi
router.use("/auth", authRoutes);

// Rute yang memerlukan otentikasi dasar (hanya login)
router.use("/transactions", authMiddleware, transactionRoutes);

// Rute dengan otorisasi berbasis peran/izin
router.use(
  "/categories",
  authMiddleware,
  authorize("view:categories"),
  categoryRoutes
);
router.use(
  "/products",
  authMiddleware,
  authorize("view:products"),
  productRoutes
);
router.use("/pos", authMiddleware, authorize("access:pos"), posRoutes);

// Rute dashboard (mungkin sebagian publik, sebagian privat, diatur di dalam controller/service)
router.use("/dashboard", summaryRoutes);

module.exports = router;
