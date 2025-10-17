// Helper untuk response sukses
function successResponse(res, payload, message = "Success", code = 200) {
  // Deteksi apakah payload sudah punya struktur data+meta
  if (payload?.data && payload?.meta) {
    return res.status(code).json({
      success: true,
      message,
      ...payload, // langsung spread, bukan bungkus di data:
    });
  }

  // Untuk kasus auth (token), kembalikan langsung tanpa pembungkus data
  if (
    payload &&
    typeof payload === "object" &&
    (payload.accessToken || payload.refreshToken)
  ) {
    return res.status(code).json({
      success: true,
      message,
      ...payload, // langsung spread token, bukan bungkus di data:
    });
  }

  return res.status(code).json({
    success: true,
    message,
    data: payload,
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
