import { API_BASE_URL } from "../config.js";

async function handleApiResponse(response) {
	// Jika server merespons dengan 204 No Content, tidak ada body untuk di-parse.
	// Kita bisa anggap ini sebagai sukses.
	if (response.status === 204) {
		return { success: true, data: null };
	}

	const responseData = await response.json().catch(() => {
		// Jika parsing JSON gagal, kemungkinan ini adalah halaman error HTML dari server.
		const error = new Error(`Server error: ${response.status} ${response.statusText}. Response is not valid JSON.`);
		error.response = response;
		throw error;
	});

	// fetch() tidak melempar error pada status HTTP error, jadi kita periksa `res.ok` secara manual.
	// Kita juga periksa properti `success: false` dari backend kita.
	if (!response.ok || responseData.success === false) {
		// Buat error dengan pesan dari backend.
		const error = new Error(responseData.message || "An unknown API error occurred.");
		error.response = response; // Lampirkan respons penuh untuk debugging
		error.data = responseData;
		throw error; // Ini akan ditangkap oleh blok .catch() di controller
	}

	return responseData;
}

export async function apiGet(path) {
	const res = await fetch(`${API_BASE_URL}/${path}`);
	return handleApiResponse(res);
}

export async function apiPost(path, body) {
	const res = await fetch(`${API_BASE_URL}/${path}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	});
	return handleApiResponse(res);
}

export async function apiPut(path, body) {
	const res = await fetch(`${API_BASE_URL}/${path}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	});
	return handleApiResponse(res);
}

export async function apiDelete(path) {
	const res = await fetch(`${API_BASE_URL}/${path}`, {
		method: "DELETE",
	});
	return handleApiResponse(res);
}
