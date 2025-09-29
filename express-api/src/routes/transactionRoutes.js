const express = require("express");
const router = express.Router();
const { createTransaction } = require("../controllers/transactionController");
const authMiddleware = require("../middlewares/authMiddleware");

// Semua route transaksi memerlukan login
router.post("/", authMiddleware, createTransaction);

module.exports = router;
