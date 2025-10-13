const express = require("express");
const router = express.Router();

const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getPaginatedCatgories,
} = require("../controllers/categoryController");
const authorize = require("../middlewares/authorizeMiddleware");

// Middleware ini sudah diterapkan di routes/index.js, jadi tidak perlu di sini.
// router.use(authMiddleware);

router.get("/", authorize("view:categories"), getCategories);
router.get("/:id", authorize("view:categories"), getCategoryById);
router.post("/", authorize("manage:categories"), createCategory);
router.put("/:id", authorize("manage:categories"), updateCategory);
router.delete("/:id", authorize("manage:categories"), deleteCategory);

module.exports = router;
