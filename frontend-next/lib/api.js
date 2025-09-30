// URL API yang berjalan di container Docker
const API_BASE_URL = process.env.EXPRESS_API_URL || "http://localhost:3000/api";
import Cookies from "js-cookie";

let isRefreshing = false;
let refreshPromise = null;

async function refreshToken() {
	try {
		const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
			method: "POST",
			credentials: "include", // Penting untuk mengirim cookie refreshToken
		});
		if (!res.ok) {
			throw new Error("Failed to refresh token");
		}
		const data = await res.json();
		if (data.data?.accessToken) {
			Cookies.set("accessToken", data.data.accessToken, { expires: 1 / 24 }); // Expire dalam 1 jam
			return data.data.accessToken;
		}
		throw new Error("No access token from refresh");
	} catch (error) {
		console.error("Session expired, logging out.", error);
		Cookies.remove("accessToken");
		// Redirect ke login, pastikan ini hanya berjalan di client-side
		if (typeof window !== "undefined") {
			window.location.href = "/login";
		}
		throw error;
	} finally {
		isRefreshing = false;
		refreshPromise = null;
	}
}

// Helper function untuk API calls
async function apiFetch(endpoint, options = {}) {
	let token = Cookies.get("accessToken");
	const headers = {
		"Content-Type": "application/json",
		...options.headers,
	};

	if (token) headers["Authorization"] = `Bearer ${token}`;

	let response = await fetch(`${API_BASE_URL}${endpoint}`, {
		...options,
		headers,
		credentials: "include", // Selalu sertakan credentials untuk cookies
	});

	if (response.status === 401 && !isRefreshing) {
		isRefreshing = true;
		refreshPromise = refreshToken();
		try {
			const newToken = await refreshPromise;
			headers["Authorization"] = `Bearer ${newToken}`;
			// Ulangi request dengan token baru
			response = await fetch(`${API_BASE_URL}${endpoint}`, {
				...options,
				headers,
				credentials: "include",
			});
		} catch (refreshError) {
			// Jika refresh gagal, lempar error asli
			throw new Error(`Session expired. Please log in again. Original error: ${response.statusText}`);
		}
	}

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message || `HTTP error: ${response.status}`);
	}

	// Simpan token setelah login berhasil
	if (data.data?.accessToken && endpoint.includes("/auth/login")) {
		Cookies.set("accessToken", data.data.accessToken, { expires: 1 / 24 }); // Expire dalam 1 jam
	}

	return data.data;
}

// --- AUTH API ---
export async function loginUser(credentials) {
	return apiFetch("/auth/login", {
		method: "POST",
		body: JSON.stringify(credentials),
	});
}

export async function signUpUser(data) {
	return apiFetch("/auth/signup", {
		method: "POST",
		body: JSON.stringify(data),
	});
}

export async function logoutUser() {
	try {
		// Panggil API untuk menghapus refresh token di server
		await apiFetch("/auth/logout", { method: "POST" });
	} catch (error) {
		console.error("API logout failed, but proceeding with client-side logout:", error);
	} finally {
		// Selalu bersihkan cookie di client dan redirect, bahkan jika API gagal
		Cookies.remove("accessToken");
		window.location.replace("/login");
	}
}

// --- Other API functions ---
export async function fetchProducts(url) {
	return apiFetch(url);
}

export async function fetchCategories(url) {
	return apiFetch(url);
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

export async function createTransaction(data) {
	return apiFetch("/transactions", {
		method: "POST",
		body: JSON.stringify(data),
	});
}

export async function fetchSummary(url) {
	return apiFetch(url);
}

export async function fetchUserProfile() {
	return apiFetch("/auth/me");
}
