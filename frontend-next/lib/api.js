// Ganti URL ini agar bisa diakses dari browser
const API_BASE_URL = process.env.EXPRESS_API_URL || "http://localhost:3000/api";

let isRefreshing = false;
let refreshPromise = null;

async function refreshToken() {
	try {
		// credentials: 'include' sangat penting untuk mengirim HttpOnly cookie
		const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
			method: "POST",
			credentials: "include",
		});

		if (!res.ok) {
			throw new Error("Failed to refresh token");
		}

		const data = await res.json();
		if (data.data.accessToken) {
			localStorage.setItem("accessToken", data.data.accessToken);
			return data.data.accessToken;
		} else {
			throw new Error("No access token received from refresh");
		}
	} catch (error) {
		console.error("Session expired, logging out.", error);
		// Jika refresh gagal, hapus token dan biarkan SWR menangani error.
		// SessionProvider akan menangani redirect.
		localStorage.removeItem("accessToken");
		// HAPUS: window.location.href = "/login";
		throw error;
	}
}

async function apiFetch(endpoint, options = {}) {
	let token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

	const headers = {
		"Content-Type": "application/json",
		...options.headers,
	};

	if (token) {
		headers["Authorization"] = `Bearer ${token}`;
	}

	let response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });

	if (response.status === 401) {
		if (!isRefreshing) {
			isRefreshing = true;
			refreshPromise = refreshToken().finally(() => {
				isRefreshing = false;
				refreshPromise = null;
			});
		}

		token = await refreshPromise;
		headers["Authorization"] = `Bearer ${token}`;
		response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
	}

	return handleApiResponse(response);
}

async function handleApiResponse(response) {
	if (response.status === 204) {
		return { success: true, data: null };
	}

	// Cek jika response bukan JSON sebelum mencoba parse
	const contentType = response.headers.get("content-type");
	if (!contentType || !contentType.includes("application/json")) {
		// Coba baca teks error, tapi jangan error jika body kosong
		let errorText = "";
		try {
			errorText = await response.text();
		} catch (e) {
			// Abaikan jika body tidak bisa dibaca
		}

		// Jika status OK tapi tidak ada JSON, anggap sukses dengan data null
		if (response.ok) {
			return { success: true, data: null };
		}

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

	// Untuk endpoint login, kita butuh seluruh response, bukan hanya `data`
	if (response.url.endsWith("/auth/login")) {
		return responseData.data; // `data` berisi { accessToken }
	}

	// Untuk endpoint lain, kembalikan bagian `data`
	return responseData.data; // `data` berisi user, products, dll.
}

// --- CATEGORY API ---
export async function fetchCategories() {
	return apiFetch("/categories");
}

export async function createCategory(data) {
	return apiFetch("/categories", {
		method: "POST",
		body: JSON.stringify(data),
	});
}

export async function updateCategory(id, data) {
	return apiFetch(`/categories/${id}`, {
		method: "PUT",
		body: JSON.stringify(data),
	});
}

export async function deleteCategoryById(id) {
	return apiFetch(`/categories/${id}`, {
		method: "DELETE",
	});
}

// --- PRODUCT API ---
export async function fetchProducts(url) {
	return apiFetch(url);
}

export async function createProduct(data) {
	return apiFetch("/products", {
		method: "POST",
		body: JSON.stringify(data),
	});
}

export async function updateProduct(id, data) {
	return apiFetch(`/products/${id}`, {
		method: "PUT",
		body: JSON.stringify(data),
	});
}

export async function deleteProductById(id) {
	return apiFetch(`/products/${id}`, {
		method: "DELETE",
	});
}

// --- TRANSACTION API ---
export async function createTransaction(data) {
	return apiFetch("/transactions", {
		method: "POST",
		body: JSON.stringify(data),
	});
}

// --- SUMMARY API ---
export async function fetchSummary(url) {
	return apiFetch(url);
}

// --- AUTH API ---
export async function loginUser(credentials) {
	// Login tidak memerlukan token, jadi panggil fetch langsung
	const res = await fetch(`${API_BASE_URL}/auth/login`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(credentials),
	});
	return handleApiResponse(res);
}

export async function signUpUser(data) {
	// Sign up tidak memerlukan token
	const res = await fetch(`${API_BASE_URL}/auth/signup`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	return handleApiResponse(res);
}

export async function logoutUser() {
	// Logout memerlukan token, jadi gunakan apiFetch
	return apiFetch("/auth/logout", {
		method: "POST",
	});
}

export async function fetchUserLogin(url) {
	return apiFetch(url);
}
