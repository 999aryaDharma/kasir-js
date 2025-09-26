// Ganti URL ini agar bisa diakses dari browser
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

async function handleApiResponse(response) {
	if (response.status === 204) {
		return { success: true, data: null };
	}

	// Cek jika response bukan JSON sebelum mencoba parse
	const contentType = response.headers.get("content-type");
	if (!contentType || !contentType.includes("application/json")) {
		const errorText = await response.text();
		const error = new Error(`Server error: ${response.status} ${response.statusText}. Response is not valid JSON.`);
		console.error("Non-JSON response body:", errorText);
		error.response = response;
		throw error;
	}

	const responseData = await response.json();

	if (!response.ok || responseData.success === false) {
		const error = new Error(responseData.message || "An unknown API error occurred.");
		error.response = response;
		error.data = responseData;
		throw error;
	}

	// Kembalikan hanya bagian `data` dari response backend Anda
	return responseData.data;
}

// --- CATEGORY API ---
export async function fetchCategories() {
	const res = await fetch(`${API_BASE_URL}/categories`);
	return handleApiResponse(res);
}

export async function createCategory(data) {
	const res = await fetch(`${API_BASE_URL}/categories`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	return handleApiResponse(res);
}

export async function updateCategory(id, data) {
	const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	return handleApiResponse(res);
}

export async function deleteCategoryById(id) {
	const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
		method: "DELETE",
	});
	// Tangani response 204 (No Content) untuk delete
	if (res.status === 204) return { success: true };
	return handleApiResponse(res);
}

// --- PRODUCT API ---
export async function fetchProducts() {
	const res = await fetch(`${API_BASE_URL}/products`);
	return handleApiResponse(res);
}

export async function createProduct(data) {
	const res = await fetch(`${API_BASE_URL}/products`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	return handleApiResponse(res);
}

export async function updateProduct(id, data) {
	const res = await fetch(`${API_BASE_URL}/products/${id}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	return handleApiResponse(res);
}

export async function deleteProductById(id) {
	const res = await fetch(`${API_BASE_URL}/products/${id}`, {
		method: "DELETE",
	});
	if (res.status === 204) return { success: true };
	return handleApiResponse(res);
}

// --- SUMMARY API ---
export async function fetchSummary() {
	const res = await fetch(`${API_BASE_URL}/summary`);
	return handleApiResponse(res);
}
