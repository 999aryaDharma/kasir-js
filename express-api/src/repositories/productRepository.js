const prisma = require('../config/prisma')

const findAllProducts = async () => {
  return await prisma.product.findMany()
}

const findProductById = async (id) => {
  return await prisma.product.findUnique({
    where: {
      id: parseInt(id),
    },
  })
}

const insertProduct = async (productData) => {
  return await prisma.product.create({
    data: productData,
  })
}

const updateProduct = async (id, productData) => {
  return await prisma.product.update({
    where: {
      id: parseInt(id),
    },
    data: productData,
  })
}

const deleteProduct = async (id) => {
  return await prisma.product.delete({
    where: {
      id: parseInt(id),
    },
  })
}

module.exports = {
  findAllProducts,
  findProductById,
  insertProduct,
  updateProduct,
  deleteProduct,
}