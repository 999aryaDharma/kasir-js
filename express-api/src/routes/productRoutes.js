const express = require("express");
const router = express.Router();

const {
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getPaginatedProducts,
} = require("../controllers/productController");
const { validateProduct } = require("../middlewares/validateMiddleware");

// Middleware ini sudah diterapkan di routes/index.js, jadi tidak perlu di sini.
// router.use(authMiddleware);

// Routes with permissions
router.get("/", getPaginatedProducts);
router.get("/:id", getProductById);
router.post("/", validateProduct, createProduct);
router.put("/:id", validateProduct, updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
