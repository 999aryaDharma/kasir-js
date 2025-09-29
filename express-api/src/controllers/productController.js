const productRepository = require("../repositories/productRepository");
const productService = require("../services/productService.js");
const { successResponse, errorResponse } = require("../utils/response");

const getAllProducts = async (req, res) => {
	try {
		const products = await productRepository.findAllProducts();
		return successResponse(res, products, "Products fetched successfully");
	} catch (error) {
		console.error("Error getting products:", error);
		return errorResponse(res, "Error getting products", 500);
	}
};

const getProductById = async (req, res) => {
	try {
		const id = parseInt(req.params.id, 10);
		if (isNaN(id)) {
			return errorResponse(res, "Invalid product ID", 400);
		}
		const product = await productRepository.findProductById(id);
		if (!product) {
			return errorResponse(res, "Product not found", 404);
		}
		return successResponse(res, product, "Product fetched successfully");
	} catch (error) {
		console.error("Error getting product by ID:", error);
		return errorResponse(res, "Error getting product", 500);
	}
};

const createProduct = async (req, res) => {
	try {
		// 1. Ambil data dari body permintaan
		const { categoryId, ...productData } = req.body;

		// Pastikan categoryId ada sebelum membuat kode
		if (!categoryId) {
			return errorResponse(res, "categoryId is required", 400);
		}

		// 2. Buat kode produk sesuai format yang diinginkan
		// Bagian pertama: categoryId, 3 digit, diisi '0' di depan jika kurang
		const categoryPart = String(categoryId).padStart(3, "0");
		// Bagian kedua: Angka random antara 0-999, 3 digit, diisi '0' di depan jika kurang
		const randomPart = String(Math.floor(Math.random() * 1000)).padStart(3, "0");

		const generatedCode = `${categoryPart}-${randomPart}`;

		// 3. Gabungkan semua data menjadi satu objek untuk disimpan
		const dataToCreate = {
			...productData,
			code: generatedCode, // Tambahkan kode yang sudah dibuat
			category: {
				connect: {
					id: categoryId,
				},
			},
		};

		// 4. Kirim data yang sudah lengkap ke service
		const product = await productService.createProduct(dataToCreate);
		return successResponse(res, product, "Product created successfully", 201);
	} catch (error) {
		console.error("Error creating product:", error);
		const status = error.statusCode || 500;
		return errorResponse(res, error.message, status);
	}
};

const updateProduct = async (req, res) => {
	try {
		const id = parseInt(req.params.id, 10);
		if (isNaN(id)) {
			return errorResponse(res, "Invalid product ID", 400);
		}
		// Langsung gunakan req.body. Service yang akan menangani logikanya.
		const dataToUpdate = req.body;
		const product = await productService.updateProduct(id, dataToUpdate);
		return successResponse(res, product, "Product updated successfully");
	} catch (error) {
		console.error(`Error updating product with ID ${req.params.id}:`, error);
		const status = error.statusCode || 500;
		return errorResponse(res, error.message, status);
	}
};

const deleteProduct = async (req, res) => {
	try {
		const id = parseInt(req.params.id, 10);
		if (isNaN(id)) {
			return errorResponse(res, "Invalid product ID", 400);
		}
		const product = await productRepository.deleteProduct(id);
		return successResponse(res, product, "Product deleted successfully");
	} catch (error) {
		console.error(`Error deleting product with ID ${req.params.id}:`, error);
		return errorResponse(res, "Error deleting product", 500);
	}
};

const getPaginatedProducts = async (req, res) => {
	try {
		let { page = 1, limit = 10, search, category } = req.query;
		page = parseInt(page, 10);
		limit = parseInt(limit, 10);
		if (isNaN(page) || page < 1) page = 1;
		if (isNaN(limit) || limit < 1) limit = 10;
		// Teruskan semua parameter ke service
		const products = await productService.getPaginatedProducts({ page, limit, search, category });
		return successResponse(res, products, "Products fetched successfully");
	} catch (error) {
		console.error("Error getting paginated products:", error);
		return errorResponse(res, "Error getting products", 500);
	}
};

module.exports = {
	getAllProducts,
	getProductById,
	createProduct,
	updateProduct,
	deleteProduct,
	getPaginatedProducts,
};
