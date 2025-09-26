const express = require("express");
const router = express.Router();

const { getAllCategory, getCategoryById, createCategory, updateCategory, deleteCategory } = require("../controllers/categoryController");
const authMiddleware = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/authorizeMiddleware");

// Semua route di bawah ini akan dijaga oleh authMiddleware (memastikan user login)
router.use(authMiddleware);

// Definisikan role. 0 = kasir, 1 = admin (sesuai schema.prisma)
const ADMIN_ROLE = 1;

router.get("/", getAllCategory); // Semua user yang login bisa melihat kategori
router.get("/:id", getCategoryById); // Semua user yang login bisa melihat detail kategori
router.post("/", authorize([ADMIN_ROLE]), createCategory); // Hanya admin
router.put("/:id", authorize([ADMIN_ROLE]), updateCategory); // Hanya admin
router.delete("/:id", authorize([ADMIN_ROLE]), deleteCategory); // Hanya admin

module.exports = router;
