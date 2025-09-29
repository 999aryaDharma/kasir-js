const express = require("express");
const router = express.Router();

const categoryRoutes = require("./categoryRoutes");
const productRoutes = require("./productRoutes");
const summaryRoutes = require("./summaryRoutes");
const authRoutes = require("./authRoutes");
const transactionRoutes = require("./transactionRoutes");

router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);
router.use("/summary", summaryRoutes);
router.use("/auth", authRoutes);
router.use("/transactions", transactionRoutes);

module.exports = router;
