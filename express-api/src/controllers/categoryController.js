const categoryRepository = require("../repositories/categoryRepository");
const { successResponse, errorResponse } = require("../utils/response");

const getAllCategory = async (req, res) => {
	try {
		const categories = await categoryRepository.findAllCategory();
		return successResponse(res, categories, "Category fetched successfully");
	} catch (error) {
		return errorResponse(res, "Error getting categories", 500);
	}
};

const getCategoryById = async (req, res) => {
	try {
		const id = req.params.id;
		const category = await categoryRepository.findCategoryById(id);
		if (!category) {
			return errorResponse(res, "Category not found", 404);
		}
		return successResponse(res, category, "Category fetched successfully");
	} catch (error) {
		return errorResponse(res, "Error getting category", 500);
	}
};

const createCategory = async (req, res) => {
	try {
		const data = req.body;
		// console.log("📥 Data diterima di controller:", data);
		const category = await categoryRepository.insertCategory(data);
		// console.log("✅ Category berhasil dibuat:", category);
		return successResponse(res, category, "Category created successfully");
	} catch (error) {
		console.log("Error creating category", error);
		return errorResponse(res, "Error creating category", 500);
	}
};

const updateCategory = async (req, res) => {
	try {
		const id = req.params.id;
		const categoryData = req.body;
		const category = await categoryRepository.updateCategory(id, categoryData);
		return successResponse(res, category, "Category updated successfully");
	} catch (error) {
		return errorResponse(res, "Error updating category", 500);
	}
};

const deleteCategory = async (req, res) => {
	try {
		const id = req.params.id;
		const category = await categoryRepository.deleteCategory(id);
		return successResponse(res, category, "Category deleted successfully");
	} catch (error) {
		return errorResponse(res, "Error deleting category", 500);
	}
};

module.exports = {
	getAllCategory,
	getCategoryById,
	createCategory,
	updateCategory,
	deleteCategory,
};
