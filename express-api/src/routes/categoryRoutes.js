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

// Middleware ini sudah diterapkan di routes/index.js, jadi tidak perlu di sini.
// router.use(authMiddleware);

router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.post("/", createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

module.exports = router;
