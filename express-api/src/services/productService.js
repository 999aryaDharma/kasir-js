const productRepo = require("../repositories/productRepository.js");
const { get } = require("../routes/productRoutes.js");
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

async function getPaginatedProducts(page, limit) {
	const offset = (page - 1) * limit;
	const products = await productRepo.findProductsPaginated(limit, offset);
	const total = await productRepo.countProducts();
	const totalPages = Math.ceil(total / limit);

	return {
		data: products,
		meta: {
			page,
			limit,
			total,
			totalPages,
		},
	};
}

module.exports = {
	createProduct,
	updateProduct,
	getPaginatedProducts,
};
