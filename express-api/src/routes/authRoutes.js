const express = require("express");
const router = express.Router();
const { login, signUp, refreshToken, logout, getMe } = require("../controllers/authController.js");
const authMiddleware = require("../middlewares/authMiddleware.js");

router.post("/login", login);
router.post("/signup", signUp);
router.post("/refresh", refreshToken); // Tidak perlu auth middleware karena menggunakan refresh token cookie
router.post("/logout", authMiddleware, logout);
router.get("/me", authMiddleware, getMe); // Endpoint untuk mendapatkan profil user

module.exports = router;
