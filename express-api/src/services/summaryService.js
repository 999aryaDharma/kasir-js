const prisma = require("../config/prisma");

const fetchSummary = async () => {
	const totalCategories = await prisma.category.count({
		where: {
			isDeleted: false,
		},
	});

	const totalProducts = await prisma.product.count({
		where: {
			isDeleted: false,
		},
	});

	return { totalCategories, totalProducts };
};

module.exports = { fetchSummary };
