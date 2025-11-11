const express = require("express");
const router = express.Router();
const { getPOSInitialData } = require("../controllers/posController");

// Endpoint untuk data awal POS (menggabungkan produk dan kategori)
// Middleware sekarang diterapkan di routes/index.js
router.get("/initial-data", getPOSInitialData);

module.exports = router;
