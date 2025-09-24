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
		const { categoryId, ...productData } = req.body;
		const dataToCreate = {
			...productData,
			category: {
				connect: {
					id: categoryId,
				},
			},
		};
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
		// Pisahkan `id` dan `categoryId` dari sisa data yang akan di-update
		const { id: bodyId, categoryId, ...dataToUpdate } = req.body;

		if (categoryId) {
			dataToUpdate.category = {
				connect: { id: categoryId },
			};
		}

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

module.exports = {
	getAllProducts,
	getProductById,
	createProduct,
	updateProduct,
	deleteProduct,
};
