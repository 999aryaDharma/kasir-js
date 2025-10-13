const prisma = require("../config/prisma");

const findAllCategory = async () => {
  return await prisma.category.findMany({
    where: {
      isDeleted: false,
    },
  });
};

const findCategoryById = async (id) => {
  return await prisma.category.findUnique({
    where: {
      id: parseInt(id),
      isDeleted: false,
    },
  });
};

const insertCategory = async (categoryData) => {
  console.log("📥 Data diterima di repository:", categoryData);
  const category = await prisma.category.create({
    data: categoryData,
  });
  console.log("✅ Hasil insert dari Prisma:", category);
  return category;
};

const updateCategory = async (id, categoryData) => {
  return await prisma.category.update({
    where: {
      id: parseInt(id),
    },
    data: categoryData,
  });
};

const deleteCategory = async (id) => {
  return await prisma.category.update({
    where: {
      id: parseInt(id),
    },
    data: {
      isDeleted: true,
    },
  });
};

const findCategoryByName = async (name) => {
  return await prisma.category.findFirst({
    where: {
      name: {
        equals: name,
        mode: "insensitive", // Pencarian tidak case-sensitive
      },
      isDeleted: false,
    },
  });
};

const countAllCategories = (filters = {}) => {
  return prisma.category.count({
    where: {
      isDeleted: false,
      ...(filters.name ? { name: filters.name } : {}),
    },
  });
};

const findPaginatedCategories = ({ limit, offset, filters = {} }) => {
  return prisma.category.findMany({
    where: {
      isDeleted: false,
      ...(filters.name ? { name: filters.name } : {}),
    },
    skip: offset,
    take: limit,
    orderBy: { createdAt: "desc" },
  });
};

module.exports = {
  findAllCategory,
  findCategoryById,
  insertCategory,
  updateCategory,
  deleteCategory,
  countAllCategories,
  findCategoryByName,
  findPaginatedCategories,
};
