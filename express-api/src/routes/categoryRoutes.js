const express = require("express");
const router = express.Router();

const { getAllCategory, getCategoryById, createCategory, updateCategory, deleteCategory } = require("../controllers/categoryController");

router.get("/categories", getAllCategory);
router.get("/categories/:id", getCategoryById);
router.post("/categories", createCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

module.exports = router;
