const AppError = require("../utils/AppError");

/**
 * Middleware factory untuk otorisasi berdasarkan role.
 * @param {number[]} allowedRoles - Array berisi role yang diizinkan (misal: [1] untuk admin).
 * @returns {function} Middleware Express.
 */
function authorize(allowedRoles) {
	return (req, res, next) => {
		// Middleware ini harus dijalankan SETELAH authMiddleware
		const userRole = req.user?.role;

		// Cek jika user memiliki role (angka 0 adalah role yang valid)
		if (userRole === undefined || userRole === null) {
			return next(new AppError("Authentication error: User role not found on token", 401));
		}

		if (allowedRoles.includes(userRole)) {
			return next(); // Role diizinkan, lanjutkan ke controller
		} else {
			return next(new AppError("Forbidden: You do not have permission to perform this action", 403));
		}
	};
}

module.exports = authorize;
