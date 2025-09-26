// Helper untuk response sukses
function successResponse(res, data, message = "Success", status = 200) {
	return res.status(status).json({
		success: true,
		message,
		data,
	});
}

// Helper untuk response error
function errorResponse(res, message = "Internal Server Error", status = 500) {
	return res.status(status).json({
		success: false,
		message,
	});
}

module.exports = {
	successResponse,
	errorResponse,
};
