const prisma = require("../config/prisma");

async function findUserByUsername(username) {
	return await prisma.user.findUnique({
		where: {
			username: username,
		},
	});
}

async function findUserById(id) {
	return await prisma.user.findUnique({
		where: { id },
	});
}

async function saveRefreshToken(userId, token, expiresAt) {
	return await prisma.refreshToken.create({
		data: {
			userId,
			token,
			expiresAt,
		},
	});
}

async function findRefreshToken(token) {
	return await prisma.refreshToken.findUnique({
		where: {
			token,
		},
		include: {
			user: true, // Sertakan data user yang terkait
		},
	});
}

async function deleteRefreshToken(token) {
	return await prisma.refreshToken.deleteMany({
		where: {
			token,
		},
	});
}

async function createUser(userData) {
	return await prisma.user.create({
		data: userData,
	});
}

async function deleteAllUserRefreshTokens(userId) {
	return await prisma.refreshToken.deleteMany({
		where: {
			userId,
		},
	});
}

module.exports = {
	findUserByUsername,
	findUserById,
	saveRefreshToken,
	findRefreshToken,
	deleteRefreshToken,
	createUser,
	deleteAllUserRefreshTokens,
};
