const AppError = require("../utils/AppError");
const { verifyAccessToken } = require("../utils/jwtUtils");

function authMiddleware(req, res, next) {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			throw new AppError("Authentication invalid: No token provided", 401);
		}

		const token = authHeader.split(" ")[1];

		if (!token) {
			throw new AppError("Authentication invalid: Malformed token", 401);
		}

		const decoded = verifyAccessToken(token);

		// Verifikasi bahwa decoded memiliki field yang diperlukan
		if (!decoded || !decoded.userId) {
			throw new AppError("Invalid token structure", 401);
		}

		// Tempelkan informasi user ke object request
		req.user = {
			userId: decoded.userId,
			role: decoded.role,
			permissions: decoded.permissions || [], // Tambahkan permissions ke req.user
		};

		next(); // Lanjutkan ke controller
	} catch (error) {
		// Tangani error JWT (misal: token expired, signature salah)
		return res.status(401).json({ success: false, message: `Authentication Failed: ${error.message}` });
	}
}

module.exports = authMiddleware;
