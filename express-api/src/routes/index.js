const express = require("express");
const router = express.Router();

const categoryRoutes = require("./categoryRoutes");
const productRoutes = require("./productRoutes");
const summaryRoutes = require("./dashboardRoutes");
const authRoutes = require("./authRoutes");
const transactionRoutes = require("./transactionRoutes");
const authMiddleware = require("../middlewares/authMiddleware");

router.use("/categories", authMiddleware, categoryRoutes);
router.use("/products", authMiddleware, productRoutes);
router.use("/dashboard", summaryRoutes);
router.use("/auth", authRoutes);
router.use("/transactions", transactionRoutes);

module.exports = router;
