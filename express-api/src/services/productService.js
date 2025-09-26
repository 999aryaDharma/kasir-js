const productRepo = require("../repositories/productRepository.js");
const AppError = require("../utils/AppError.js");

async function createProduct(data) {
	const { costPrice, sellingPrice } = data;
	if (sellingPrice < costPrice) {
		throw new AppError("Selling price must be greater than or equal to cost price", 400);
	}
	const product = await productRepo.insertProduct(data);
	return product;
}

async function updateProduct(data) {
	const { costPrice, sellingPrice } = data;
	if (sellingPrice < costPrice) {
		throw new AppError("Selling price must be greater than or equal to cost price", 400);
	}
	const product = await productRepo.updateProduct(data);
	return product;
}

module.exports = {
	createProduct,
	updateProduct,
};
