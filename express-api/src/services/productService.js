const productRepo = require("../repositories/productRepository.js");
const categoryRepository = require("../repositories/categoryRepository.js");
const AppError = require("../utils/AppError.js");

async function createProduct(data) {
	const { costPrice, sellingPrice } = data;
	if (sellingPrice < costPrice) {
		throw new AppError("Selling price must be greater than or equal to cost price", 400);
	}
	const product = await productRepo.createProduct(data);
	return product;
}

async function updateProduct(data) {
	const { costPrice, sellingPrice } = data;
	if (sellingPrice < costPrice) {
		throw new AppError("Selling price must be greater than or equal to cost price", 400);
	}
	const product = await productRepo.updateProduct(id, data);
	return product;
}

async function getPaginatedProducts({ page, limit, search, category }) {
	const offset = (page - 1) * limit;

	// Buat objek filter untuk Prisma
	const filters = {};
	if (search) {
		filters.OR = [
			{ name: { contains: search, mode: "insensitive" } }, // Cari berdasarkan nama
			{ code: { contains: search, mode: "insensitive" } }, // Cari berdasarkan kode
		];
	}

	if (category) {
		const categoryData = await categoryRepository.findCategoryByName(category);
		if (categoryData) {
			filters.categoryId = categoryData.id;
		}
	}

	const products = await productRepo.findPaginatedProducts({
		limit,
		offset,
		filters,
	});
	const totalProducts = await productRepo.countAllProducts(filters);

	const totalPages = Math.ceil(totalProducts / limit);

	return {
		data: products,
		meta: {
			page,
			limit,
			total: totalProducts,
			totalPages,
		},
	};
}

module.exports = {
	createProduct,
	updateProduct,
	getPaginatedProducts,
};
