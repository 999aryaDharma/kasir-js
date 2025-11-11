const categoryRepo = require("../repositories/categoryRepository.js");
const AppError = require("../utils/AppError.js");

async function getCategories({ page, limit, search }) {
  const hasPagination = page && limit;
  const offset = hasPagination ? (page - 1) * limit : 0;

  const filters = {};
  if (search) {
    filters.name = { contains: search, mode: "insensitive" };
  }

  if (hasPagination) {
    const [categories, totalCategories] = await Promise.all([
      categoryRepo.findPaginatedCategories({ limit, offset, filters }),
      categoryRepo.countAllCategories(filters),
    ]);

    const totalPages = Math.ceil(totalCategories / limit);

    return {
      data: categories,
      meta: {
        page,
        limit,
        total: totalCategories,
        totalPages,
      },
    };
  }

  const categories = await categoryRepo.findAllCategory();
  return categories;
}

module.exports = {
  getCategories,
};
