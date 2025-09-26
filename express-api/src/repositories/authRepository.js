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
		// Pilih field yang ingin dikembalikan, jangan sertakan password
		select: {
			id: true,
			username: true,
			role: true,
		},
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
	return await prisma.refreshToken.delete({
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

module.exports = {
	findUserByUsername,
	findUserById,
	saveRefreshToken,
	findRefreshToken,
	deleteRefreshToken,
	createUser,
};
