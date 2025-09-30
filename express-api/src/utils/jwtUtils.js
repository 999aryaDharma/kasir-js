const jwt = require("jsonwebtoken");

const JWT_ACCESS_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const ACCESS_TOKEN_EXPIRATION = "1hr";
const REFRESH_TOKEN_EXPIRATION = "7d";

// Role definitions
const ROLES = {
	CASHIER: 0,
	ADMIN: 1,
};

// Define permissions for each role
const ROLE_PERMISSIONS = {
	[ROLES.ADMIN]: ["manage:users", "manage:products", "manage:categories", "view:reports", "manage:transactions", "access:dashboard"],
	[ROLES.CASHIER]: ["create:transactions", "view:products", "view:categories", "access:pos"],
};

/**
 * Get permissions for a specific role
 * @param {number} role - Role ID
 * @returns {string[]} Array of permissions
 */
function getPermissionsForRole(role) {
	return ROLE_PERMISSIONS[role] || [];
}

/**
 * Membuat Access Token baru.
 * @param {object} user - User object dari database
 * @returns {string} Access Token.
 */
function generateAccessToken(user) {
	const permissions = getPermissionsForRole(user.role);
	const tokenPayload = {
		sub: user.id, // standard JWT claim untuk user ID
		userId: user.id, // duplikat untuk backward compatibility
		username: user.username,
		role: user.role || 0, // default ke CASHIER (0)
		permissions,
		iat: Math.floor(Date.now() / 1000), // issued at timestamp
	};
	return jwt.sign(tokenPayload, JWT_ACCESS_SECRET, {
		expiresIn: ACCESS_TOKEN_EXPIRATION,
		algorithm: "HS256", // explicit algorithm
	});
}

/**
 * Memverifikasi Access Token.
 * @param {string} token - Access Token yang akan diverifikasi.
 * @returns {object} Payload yang sudah di-decode.
 */
function verifyAccessToken(token) {
	return jwt.verify(token, JWT_ACCESS_SECRET);
}

/**
 * Membuat Refresh Token baru.
 * @param {object} payload - Data yang akan dimasukkan ke dalam token (cukup userId).
 * @returns {string} Refresh Token.
 */
function generateRefreshToken(payload) {
	return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION });
}

/**
 * Memverifikasi Refresh Token.
 * @param {string} token - Refresh Token yang akan diverifikasi.
 * @returns {object} Payload yang sudah di-decode.
 */
function verifyRefreshToken(token) {
	return jwt.verify(token, JWT_REFRESH_SECRET);
}

module.exports = {
	generateAccessToken,
	verifyAccessToken,
	generateRefreshToken,
	verifyRefreshToken,
	getPermissionsForRole,
	ROLES,
};
