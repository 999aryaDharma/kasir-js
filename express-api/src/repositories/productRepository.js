const prisma = require("../config/prisma");

const findAllProducts = async () => {
	return await prisma.product.findMany({
		where: {
			isDeleted: false,
		},
		include: {
			category: true,
		},
	});
};

const findProductById = async (id) => {
	return await prisma.product.findUnique({
		where: {
			id: id,
			isDeleted: false,
		},
		include: {
			category: true,
		},
	});
};

const insertProduct = async (productData) => {
	return await prisma.product.create({
		data: productData,
	});
};

const updateProduct = async (id, productData) => {
	// Pisahkan categoryId dari data produk lainnya jika ada
	const { categoryId, ...rest } = productData;
	const dataToUpdate = { ...rest };

	// Jika categoryId dikirim, buat struktur 'connect'
	if (categoryId) {
		dataToUpdate.category = {
			connect: { id: categoryId },
		};
	}

	return await prisma.product.update({
		where: {
			id: id,
		},
		data: dataToUpdate,
	});
};

const deleteProduct = async (id) => {
	return await prisma.product.update({
		where: {
			id: id,
		},
		data: {
			isDeleted: true,
		},
	});
};

const countAllProducts = async (filters = {}) => {
	return await prisma.product.count({
		where: {
			isDeleted: false,
			...filters,
		},
	});
};

const findPaginatedProducts = ({ limit, offset, filters = {} }) => {
	return prisma.product.findMany({
		where: {
			isDeleted: false,
			...filters,
		},
		include: {
			category: true,
		},
		take: limit,
		skip: offset,
		orderBy: {
			createdAt: "desc",
		},
	});
};

module.exports = {
	findAllProducts,
	findProductById,
	insertProduct,
	updateProduct,
	deleteProduct,
	countAllProducts,
	findPaginatedProducts,
};
