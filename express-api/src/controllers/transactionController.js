const transactionService = require("../services/transactionService");
const { successResponse, errorResponse } = require("../utils/response");

const createTransaction = async (req, res) => {
	try {
		const { items, total, pay } = req.body;
		const userId = req.user.userId; // Diambil dari authMiddleware

		const change = pay - total;

		const transactionData = { userId, total, pay, change, items };

		const newTransaction = await transactionService.processTransaction(transactionData);

		return successResponse(res, { transactionId: newTransaction.id, change }, "Transaction successful", 201);
	} catch (error) {
		console.error("Error creating transaction:", error);
		const status = error.statusCode || 500;
		return errorResponse(res, error.message, status);
	}
};

module.exports = {
	createTransaction,
};
