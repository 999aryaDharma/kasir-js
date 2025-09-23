const productRepository = require("../repositories/productRepository");
const { successResponse, errorResponse } = require("../utils/response");

const getAllProducts = async (req, res) => {
	try {
		const products = await productRepository.findAllProducts();
		return successResponse(res, products, "Products fetched successfully");
	} catch (error) {
		return errorResponse(res, "Error getting products", 500);
	}
};

const getProductById = async (req, res) => {
	try {
		const id = req.params.id;
		const product = await productRepository.findProductById(id);
		if (!product) {
			return errorResponse(res, "Product not found", 404);
		}
		return successResponse(res, product, "Product fetched successfully");
	} catch (error) {
		return errorResponse(res, "Error getting product", 500);
	}
};

const createProduct = async (req, res) => {
	try {
		const productData = req.body;
		const product = await productRepository.insertProduct(productData);
		return successResponse(res, product, "Product created successfully", 201);
	} catch (error) {
		return errorResponse(res, "Error creating product", 500);
	}
};

const updateProduct = async (req, res) => {
	try {
		const id = req.params.id;
		const productData = req.body;
		const product = await productRepository.updateProduct(id, productData);
		return successResponse(res, product, "Product updated successfully");
	} catch (error) {
		return errorResponse(res, "Error updating product", 500);
	}
};

const deleteProduct = async (req, res) => {
	try {
		const id = req.params.id;
		const product = await productRepository.deleteProduct(id);
		return successResponse(res, product, "Product deleted successfully");
	} catch (error) {
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
