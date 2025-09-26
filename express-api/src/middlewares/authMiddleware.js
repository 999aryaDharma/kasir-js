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

		// Tempelkan informasi user ke object request
		req.user = decoded;

		next(); // Lanjutkan ke controller
	} catch (error) {
		// Tangani error JWT (misal: token expired, signature salah)
		return res.status(401).json({ success: false, message: `Authentication Failed: ${error.message}` });
	}
}

module.exports = authMiddleware;
