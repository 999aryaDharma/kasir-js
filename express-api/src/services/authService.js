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

	const accessTokenPayload = { userId: user.id, role: user.role };
	const refreshTokenPayload = { userId: user.id };

	const accessToken = generateAccessToken(accessTokenPayload);
	const refreshToken = generateRefreshToken(refreshTokenPayload);

	// Simpan refresh token di database untuk validasi saat refresh dan logout
	await authRepository.saveRefreshToken(user.id, refreshToken, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));

	return { accessToken, refreshToken };
}

async function refreshAccessToken(token) {
	if (!token) {
		throw new AppError("Refresh token not provided", 401);
	}

	try {
		const decoded = verifyRefreshToken(token);
		const user = await authRepository.findUserById(decoded.userId);

		if (!user || user.refreshToken !== token) {
			throw new AppError("Invalid refresh token", 403);
		}

		const accessTokenPayload = { userId: user.id, role: user.role };
		const accessToken = generateAccessToken(accessTokenPayload);

		return { accessToken };
	} catch (error) {
		// Jika token tidak valid (kadaluarsa, dll), lempar error
		throw new AppError("Invalid or expired refresh token", 403);
	}
}

async function logout(token) {
	if (!token) {
		return; // Tidak ada token untuk di-invalidate
	}
	try {
		const decoded = verifyRefreshToken(token);
		await authRepository.updateUser(decoded.userId, { refreshToken: null });
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
	// Pastikan tidak mengirim password atau data sensitif lainnya
	const { password, refreshToken, ...userProfile } = user;
	return userProfile;
}

module.exports = {
	signUp,
	login,
	refreshAccessToken,
	logout,
	getProfile,
};
