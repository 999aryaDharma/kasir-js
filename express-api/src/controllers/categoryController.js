const categoryRepository = require("../repositories/categoryRepository");
const categoryService = require("../services/categoryService.js");
const { successResponse, errorResponse } = require("../utils/response");

const getCategories = async (req, res) => {
  try {
    let { page, limit, search } = req.query;
    page = page ? parseInt(page, 10) : undefined;
    limit = limit ? parseInt(limit, 10) : undefined;

    const result = await categoryService.getCategories({
      page,
      limit,
      search,
    });
    return successResponse(res, result, "Categories fetched successfully");
  } catch (error) {
    console.error("Error getting categories:", error);
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

const getPaginatedCatgories = async (req, res) => {
  try {
    let { page, limit, search } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 10;

    const products = await categoryService.getPaginatedCatgories({
      page,
      limit,
      search,
    });
  } catch (error) {
    console.error("Error getting paginated products:", error);
    return errorResponse(res, "Error getting products", 500);
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getPaginatedCatgories,
};
