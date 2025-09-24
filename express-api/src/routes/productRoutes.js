const express = require("express");
const router = express.Router();

const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } = require("../controllers/productController");
const { validateProduct } = require("../middlewares/validateMiddleware");

router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);
router.post("/products", createProduct, validateProduct);
router.put("/products/:id", updateProduct, validateProduct);
router.delete("/products/:id", deleteProduct);

module.exports = router;
