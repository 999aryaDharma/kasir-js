const prisma = require("../config/prisma");

const findAllProducts = async () => {
	return await prisma.product.findMany({
		where: {
			isDeleted: false,
		},
	});
};

const findProductById = async (id) => {
	return await prisma.product.findUnique({
		where: {
			id: id,
			isDeleted: false,
		},
	});
};

const insertProduct = async (productData) => {
	return await prisma.product.create({
		data: productData,
	});
};

const updateProduct = async (id, productData) => {
	return await prisma.product.update({
		where: {
			id: id,
		},
		data: productData,
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

module.exports = {
	findAllProducts,
	findProductById,
	insertProduct,
	updateProduct,
	deleteProduct,
};
