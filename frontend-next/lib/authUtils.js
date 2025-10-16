"use client";

import Cookies from "js-cookie";
import { decodeJWT as parseJwt } from "./jwt"; 

// Get user data from token
export function getAuthUser() {
	const token = Cookies.get("accessToken");
	if (!token) return null;

	return parseJwt(token);
}

// Check if user has specific permission
export function hasPermission(permission) {
	const user = getAuthUser();
	if (!user || !user.permissions) return false;

	return user.permissions.includes(permission);
}

// Check if user has all required permissions
export function hasAllPermissions(permissions) {
	const user = getAuthUser();
	if (!user || !user.permissions) return false;

	return permissions.every((p) => user.permissions.includes(p));
}

// Fungsi untuk login
export const handleAuthSuccess = (data) => {
	console.log("handleAuthSuccess called with:", data);
	const { accessToken } = data;

	if (!accessToken) {
		console.error("No access token received in handleAuthSuccess");
		return;
	}

	// Parse token untuk mendapatkan data user
	const decodedToken = parseJwt(accessToken);
	if (!decodedToken) {
		console.error("Invalid token format");
		return;
	}

	// Default ke POS jika tidak ada permissions
	let redirectPath = "/pos";

	// Cek permissions jika ada
	if (decodedToken && decodedToken.permissions) {
		redirectPath = decodedToken.permissions.includes("access:dashboard") ? "/dashboard" : "/pos";
	} else {
		// Fallback jika tidak ada permissions (seharusnya tidak terjadi)
		redirectPath = decodedToken.role === 1 ? "/dashboard" : "/pos";
	}

	// Gunakan window.location untuk memastikan full page reload
	// Ini akan memicu middleware untuk memproses rute yang benar
	window.location.replace(redirectPath);
};

// Fungsi untuk logout
export const handleLogout = () => {
	Cookies.remove("accessToken");
	// Redirect ke login dengan full page reload
	window.location.replace("/login");
};
