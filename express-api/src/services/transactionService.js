const transactionRepository = require("../repositories/transactionRepository");
const AppError = require("../utils/AppError");

async function processTransaction(transactionData) {
	// Di sini bisa menambahkan validasi lebih lanjut jika perlu
	// Misalnya, cek apakah stok cukup sebelum meneruskan ke repository

	return await transactionRepository.createTransaction(transactionData);
}

module.exports = { processTransaction };
