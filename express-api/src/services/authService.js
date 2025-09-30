const authRepository = require("../repositories/authRepository.js");
const bcrypt = require("bcrypt");
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require("../utils/jwtUtils.js");
const AppError = require("../utils/AppError.js");

async function signUp(username, password) {
	const existingUser = await authRepository.findUserByUsername(username);
	if (existingUser) {
		throw new AppError("Username already exists", 409); // 409 Conflict
	}

	const hashedPassword = await bcrypt.hash(password, 10);
	const newUser = await authRepository.createUser({
		username,
		password: hashedPassword,
	});

	return newUser;
}

async function login(username, password) {
	const user = await authRepository.findUserByUsername(username);
	if (!user) {
		throw new AppError("Invalid username or password", 401);
	}

	const isPasswordValid = await bcrypt.compare(password, user.password);
	if (!isPasswordValid) {
		throw new AppError("Invalid username or password", 401);
	}

	const accessToken = generateAccessToken(user);
	const refreshToken = generateRefreshToken(user);

	// Hapus refresh token lama jika ada
	await authRepository.deleteAllUserRefreshTokens(user.id);

	// Simpan refresh token baru di database
	await authRepository.saveRefreshToken(user.id, refreshToken, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));

	return { accessToken, refreshToken };
}

async function refreshAccessToken(token) {
	if (!token) {
		throw new AppError("Refresh token not provided", 401);
	}

	try {
		// 1. Verifikasi tanda tangan (signature) dan masa berlaku JWT
		const decoded = verifyRefreshToken(token);

		// 2. Cari token di database untuk memastikan token belum dicabut (misal, karena logout)
		const refreshTokenData = await authRepository.findRefreshToken(token);

		// 3. Jika tidak ada di DB, atau user tidak terkait, token tidak valid (sudah di-logout)
		if (!refreshTokenData || !refreshTokenData.user || refreshTokenData.userId !== decoded.userId) {
			throw new AppError("Invalid refresh token", 403);
		}

		// 4. Buat access token dan refresh token baru (rotasi refresh token)
		const { user } = refreshTokenData;
		const accessTokenPayload = { userId: user.id, role: user.role };
		const refreshTokenPayload = { userId: user.id };

		const accessToken = generateAccessToken(accessTokenPayload);
		const newRefreshToken = generateRefreshToken(refreshTokenPayload);

		// 5. Simpan refresh token baru dan hapus yang lama
		await authRepository.deleteRefreshToken(token);
		await authRepository.saveRefreshToken(user.id, newRefreshToken, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));

		return { accessToken, refreshToken: newRefreshToken };
	} catch (error) {
		// Tangani error dari jwt.verify (misal: TokenExpiredError, JsonWebTokenError)
		if (error.name === "TokenExpiredError") {
			await authRepository.deleteRefreshToken(token); // Hapus token kedaluwarsa dari DB
			throw new AppError("Refresh token expired", 401);
		}
		// Lempar kembali error lain (termasuk AppError dari blok try)
		throw error;
	}
}

async function logout(token) {
	if (!token) {
		return; // Tidak ada token untuk di-invalidate
	}
	try {
		// Cukup hapus refresh token dari database.
		// Jika token tidak ada, prisma akan mengabaikannya.
		await authRepository.deleteRefreshToken(token);
	} catch (error) {
		// Abaikan jika token tidak valid, karena tujuannya adalah logout
		console.error("Error during logout, ignoring:", error.message);
	}
}

async function getProfile(userId) {
	const user = await authRepository.findUserById(userId);
	if (!user) {
		throw new AppError("User not found", 404);
	}

	// Jangan kirim password dan data sensitif lainnya
	const { password, ...userProfile } = user;
	return userProfile;
}

module.exports = {
	signUp,
	login,
	refreshAccessToken,
	logout,
	getProfile,
};
