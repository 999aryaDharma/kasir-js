const prisma = require("../config/prisma");

const createTransaction = async (transactionData) => {
	const { userId, total, pay, change, items } = transactionData;

	// Gunakan Prisma Transaction untuk memastikan konsistensi data
	return prisma.$transaction(async (tx) => {
		// 1. Buat record transaksi utama
		const transaction = await tx.transaction.create({
			data: {
				userId,
				total,
				pay,
				change,
			},
		});

		// 2. Siapkan data untuk TransactionItem
		const transactionItemsData = items.map((item) => ({
			transactionId: transaction.id,
			productId: item.id,
			quantity: item.quantity,
			sellingPrice: item.sellingPrice,
			costPrice: item.costPrice,
			subtotal: item.sellingPrice * item.quantity,
		}));

		// 3. Buat semua record TransactionItem
		await tx.transactionItem.createMany({
			data: transactionItemsData,
		});

		// 4. Kurangi stok untuk setiap produk
		for (const item of items) {
			await tx.product.update({
				where: { id: item.id },
				data: {
					stock: {
						decrement: item.quantity,
					},
				},
			});
		}

		return transaction;
	});
};

module.exports = { createTransaction };
