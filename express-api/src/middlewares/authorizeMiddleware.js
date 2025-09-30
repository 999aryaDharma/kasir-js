const AppError = require("../utils/AppError");

/**
 * Middleware factory untuk otorisasi berdasarkan permission.
 * @param {string|string[]} requiredPermissions - Permission atau array of permissions yang dibutuhkan
 * @returns {function} Middleware Express
 */
function authorize(requiredPermissions) {
	return (req, res, next) => {
		// Middleware ini harus dijalankan SETELAH authMiddleware
		const userPermissions = req.user?.permissions;

		if (!userPermissions) {
			return next(new AppError("Authentication error: User permissions not found in token", 401));
		}

		// Konversi single permission menjadi array
		const permissions = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];

		// Cek apakah user memiliki semua permission yang dibutuhkan
		const hasAllPermissions = permissions.every((permission) => userPermissions.includes(permission));

		if (hasAllPermissions) {
			return next();
		}

		return next(new AppError("Forbidden: Insufficient permissions", 403));
	};
}

module.exports = authorize;
