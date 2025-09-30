const express = require("express");
const router = express.Router();

const { getAllCategory, getCategoryById, createCategory, updateCategory, deleteCategory } = require("../controllers/categoryController");
const authMiddleware = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/authorizeMiddleware");

// Middleware ini sudah diterapkan di routes/index.js, jadi tidak perlu di sini.
// router.use(authMiddleware);

router.get("/", authorize("view:categories"), getAllCategory);
router.get("/:id", authorize("view:categories"), getCategoryById);
router.post("/", authorize("manage:categories"), createCategory);
router.put("/:id", authorize("manage:categories"), updateCategory);
router.delete("/:id", authorize("manage:categories"), deleteCategory);

module.exports = router;
