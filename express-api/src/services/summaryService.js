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

	const totalTransactions = await prisma.transaction.count();

	const totalRevenueMonthly = await prisma.transaction.aggregate({
		where: {
			createdAt: {
				gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // Awal bulan ini
				lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1), // Awal bulan depan
			},
		},
		_sum: {
			total: true,
		},
	});

	// Mengambil semua item transaksi bulan ini untuk menghitung profit
	const monthlyTransactionItems = await prisma.transactionItem.findMany({
		where: {
			transaction: {
				createdAt: {
					gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // Awal bulan ini
					lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1), // Awal bulan depan
				},
			},
		},
		select: {
			quantity: true,
			sellingPrice: true,
			costPrice: true,
		},
	});

	// Menghitung total profit
	const totalProfitMonthly = monthlyTransactionItems.reduce((acc, item) => {
		const itemProfit = (Number(item.sellingPrice) - Number(item.costPrice)) * item.quantity;
		return acc + itemProfit;
	}, 0);

	return {
		totalCategories,
		totalProducts,
		totalTransactions,
		totalRevenueMonthly: totalRevenueMonthly._sum.total || 0,
		totalProfitMonthly,
	};
};

module.exports = { fetchSummary };
