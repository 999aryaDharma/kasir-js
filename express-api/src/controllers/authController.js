const authService = require("../services/authService.js");
const { successResponse, errorResponse } = require("../utils/response.js");

async function signUp(req, res) {
	try {
		const { username, password } = req.body;
		if (!username || !password) {
			return errorResponse(res, "Username and password are required", 400);
		}
		const newUser = await authService.signUp(username, password);
		// Jangan kembalikan password hash ke client
		const userResponse = {
			id: newUser.id,
			username: newUser.username,
		};
		return successResponse(res, userResponse, "User created successfully", 201);
	} catch (error) {
		const statusCode = error.statusCode || 500;
		const message = error.message || "Internal Server Error";
		return errorResponse(res, message, statusCode);
	}
}

async function login(req, res) {
	try {
		const { username, password } = req.body;

		if (!username || !password) {
			return errorResponse(res, "Username and password are required", 400);
		}

		const { accessToken, refreshToken } = await authService.login(username, password);

		// Simpan refresh token di httpOnly cookie untuk keamanan
		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production", // true di production
			sameSite: "lax", // 'lax' lebih cocok untuk auth cross-site seperti ini
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari
		});

		return successResponse(res, { accessToken }, "Login successful");
	} catch (error) {
		const statusCode = error.statusCode || 500;
		const message = error.message || "Internal Server Error";
		return errorResponse(res, message, statusCode);
	}
}

async function refreshToken(req, res) {
	try {
		const token = req.cookies.refreshToken;
		const { accessToken } = await authService.refreshAccessToken(token);
		return successResponse(res, { accessToken }, "Token refreshed successfully");
	} catch (error) {
		const statusCode = error.statusCode || 401;
		const message = error.message || "Failed to refresh token";
		return errorResponse(res, message, statusCode);
	}
}

async function logout(req, res) {
	try {
		const token = req.cookies.refreshToken;
		await authService.logout(token);

		// Hapus cookie dari browser
		res.clearCookie("refreshToken", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
		});

		return successResponse(res, null, "Logout successful");
	} catch (error) {
		return errorResponse(res, "Logout failed", 500);
	}
}

async function getMe(req, res) {
	try {
		// req.user diisi oleh authMiddleware
		const userId = req.user.userId;
		const userProfile = await authService.getProfile(userId);
		return successResponse(res, userProfile, "Profile fetched successfully");
	} catch (error) {
		const statusCode = error.statusCode || 500;
		const message = error.message || "Internal Server Error";
		return errorResponse(res, message, statusCode);
	}
}

module.exports = {
	login,
	signUp,
	refreshToken,
	logout,
	getMe,
};
