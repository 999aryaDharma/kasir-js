const productRepository = require("../repositories/productRepository");
const categoryRepository = require("../repositories/categoryRepository");
const { successResponse, errorResponse } = require("../utils/response");

const getPOSInitialData = async (req, res) => {
  try {
    // Jalankan semua permintaan secara paralel untuk efisiensi
    const [products, categories] = await Promise.all([
      productRepository.findAllProducts(), // Ambil semua produk (untuk POS bisa di limit nanti)
      categoryRepository.findAllCategory() // Ambil semua kategori
    ]);

    const posData = {
      products,
      categories,
      timestamp: new Date().toISOString()
    };

    return successResponse(res, posData, "POS initial data retrieved successfully.");
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

module.exports = {
  getPOSInitialData
};