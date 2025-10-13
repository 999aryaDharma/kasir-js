const express = require("express");
const router = express.Router();

const { getProductById, createProduct, updateProduct, deleteProduct, getPaginatedProducts } = require("../controllers/productController");
const authorize = require("../middlewares/authorizeMiddleware");
const { validateProduct } = require("../middlewares/validateMiddleware");

// Middleware ini sudah diterapkan di routes/index.js, jadi tidak perlu di sini.
// router.use(authMiddleware);

// Routes with permissions
router.get("/", authorize("view:products"), getPaginatedProducts);
router.get("/:id", authorize("view:products"), getProductById);
router.post("/", authorize("manage:products"), validateProduct, createProduct);
router.put("/:id", authorize("manage:products"), validateProduct, updateProduct);
router.delete("/:id", authorize("manage:products"), deleteProduct);

module.exports = router;
