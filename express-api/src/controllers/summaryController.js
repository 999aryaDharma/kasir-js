const { getSummaryData } = require("../services/summaryService.js");
const { successResponse, errorResponse } = require("../utils/response");

const getSummary = async (req, res) => {
  try {
    const summary = await getSummaryData();
    return successResponse(res, summary);
  } catch (error) {
    errorResponse(res, error.message);
  }
};

module.exports = { getSummary };
