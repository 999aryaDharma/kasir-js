import { NextResponse } from "next/server";
import { decodeJWT } from "./lib/jwt";

export async function middleware(request) {
	// 1. Ambil token dari cookies
	const token = request.cookies.get("accessToken")?.value;
	const decodedToken = token ? decodeJWT(token) : null;

	// Define public routes that don't need authentication
	const publicRoutes = ["/login", "/sign-up"];
	const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname);

	// 2. Jika user sudah login (ada token) dan mencoba akses halaman publik, redirect.
	if (decodedToken && isPublicRoute) {
		// Redirect ke dashboard untuk admin, ke pos untuk kasir
		const redirectUrl = decodedToken.role === 1 ? "/dashboard" : "/pos";
		return NextResponse.redirect(new URL(redirectUrl, request.url));
	}

	// 3. Jika user belum login (tidak ada token) dan mencoba akses halaman terproteksi, redirect ke login.
	if (!decodedToken && !isPublicRoute) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	// 4. Jika user sudah login, lakukan otorisasi berdasarkan role
	if (decodedToken) {
		const { role } = decodedToken;
		const { pathname } = request.nextUrl;

		// Kasir (role 0) hanya boleh akses /pos
		if (role === 0 && !pathname.startsWith("/pos")) {
			return NextResponse.redirect(new URL("/pos", request.url));
		}
	}

	return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
	matcher: ["/", "/login", "/sign-up", "/pos/:path*", "/dashboard/:path*", "/products/:path*", "/categories/:path*"],
};
