const jwt = require("jsonwebtoken");

const JWT_ACCESS_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const ACCESS_TOKEN_EXPIRATION = "15m";
const REFRESH_TOKEN_EXPIRATION = "7d";

/**
 * Membuat Access Token baru.
 * @param {object} payload - Data yang akan dimasukkan ke dalam token (misal: { userId, role }).
 * @returns {string} Access Token.
 */
function generateAccessToken(payload) {
	return jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRATION });
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
};
