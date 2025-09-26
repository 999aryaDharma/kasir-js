const { fetchSummary } = require("../services/summaryService");
const { successResponse, errorResponse } = require("../utils/response");

const getSummary = async (req, res) => {
	try {
		const summary = await fetchSummary();
		return successResponse(res, summary);
	} catch (error) {
		errorResponse(res, error.message);
	}
};

module.exports = { getSummary };
