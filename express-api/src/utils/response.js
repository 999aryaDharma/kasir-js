// Helper untuk response sukses
function successResponse(res, payload, message = "Success", code = 200) {
  // Set caching headers untuk response
  if (code === 200) {
    // Untuk data dashboard yang di-cache, set cache browser
    res.set({
      'Cache-Control': 'public, max-age=300, stale-while-revalidate=60', // Cache 5 menit, stale 1 menit
      'Expires': new Date(Date.now() + 300000).toUTCString(), // 5 menit dari sekarang
    });
  }

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
