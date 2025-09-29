const express = require("express");
const router = express.Router();

const { getProductById, createProduct, updateProduct, deleteProduct, getPaginatedProducts } = require("../controllers/productController");
const authMiddleware = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/authorizeMiddleware");
const { validateProduct } = require("../middlewares/validateMiddleware");

// Semua route di bawah ini akan dijaga oleh authMiddleware
router.use(authMiddleware);

// Definisikan role. 0 = kasir, 1 = admin (sesuai schema.prisma)
const ADMIN_ROLE = 1;

router.get("/", getPaginatedProducts); // Semua user yang login bisa melihat produk
router.get("/:id", getProductById); // Semua user yang login bisa melihat detail produk
router.post("/", authorize([ADMIN_ROLE]), validateProduct, createProduct); // Hanya admin
router.put("/:id", authorize([ADMIN_ROLE]), validateProduct, updateProduct); // Hanya admin
router.delete("/:id", authorize([ADMIN_ROLE]), deleteProduct); // Hanya admin

module.exports = router;
