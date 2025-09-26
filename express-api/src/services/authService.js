const authRepo = require("../repositories/authRepository.js");
const AppError = require("../utils/AppError.js");

const bcrypt = require("bcrypt");
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require("../utils/jwtUtils.js");

async function signUp(username, password) {
	// Cek apakah user sudah ada
	const existingUser = await authRepo.findUserByUsername(username);
	if (existingUser) {
		throw new AppError("Username already taken", 400);
	}
	const hashedPassword = await bcrypt.hash(password, 10);
	const newUser = await authRepo.createUser({ username, password: hashedPassword });
	return newUser;
}

async function login(username, password) {
	const user = await authRepo.findUserByUsername(username);
	if (!user) {
		throw new AppError("User not found", 404);
	}

	const match = await bcrypt.compare(password, user.password);
	if (!match) {
		throw new AppError("Invalid password", 401);
	}

	const accessToken = generateAccessToken({ userId: user.id, role: user.role });
	const refreshToken = generateRefreshToken({ userId: user.id });

	await authRepo.saveRefreshToken(user.id, refreshToken, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));

	return { accessToken, refreshToken };
}

async function refreshAccessToken(token) {
	if (!token) {
		throw new AppError("Refresh token not provided", 401);
	}

	// 1. Verifikasi token menggunakan JWT_REFRESH_SECRET
	const decoded = verifyRefreshToken(token);

	// 2. Cek apakah token ada di DB dan masih valid
	const tokenFromDb = await authRepo.findRefreshToken(token);
	if (!tokenFromDb || tokenFromDb.expiresAt < new Date()) {
		throw new AppError("Invalid or expired refresh token", 403);
	}

	// 3. Buat access token baru
	const { user } = tokenFromDb;
	const newAccessToken = generateAccessToken({ userId: user.id, role: user.role });

	return { accessToken: newAccessToken };
}

async function logout(token) {
	if (token) {
		// Tidak perlu melempar error jika token tidak ada, cukup lanjutkan
		await authRepo.deleteRefreshToken(token).catch(() => {
			// Abaikan error jika token sudah tidak ada di DB
		});
	}
}

async function getProfile(userId) {
	const user = await authRepo.findUserById(userId);
	if (!user) {
		throw new AppError("User not found", 404);
	}
	// Anda bisa menambahkan data lain di sini jika perlu
	return user;
}

module.exports = {
	login,
	signUp,
	refreshAccessToken,
	logout,
	getProfile,
};
