"use client";

import { createContext, useContext, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import useSWR from "swr";
import { fetchUserLogin } from "@/lib/api";

const AuthContext = createContext();

export function useAuth() {
	return useContext(AuthContext);
}

export function SessionProvider({ children }) {
	const router = useRouter();
	const pathname = usePathname();

	// Gunakan SWR untuk mengambil data user.
	// SWR akan secara otomatis menggunakan `apiFetch` yang sudah memiliki logika refresh token.
	const {
		data: user,
		error,
		isLoading,
	} = useSWR(
		// Hanya fetch jika kita tidak di halaman login/signup
		!["/login", "/sign-up"].includes(pathname) ? "/auth/me" : null,
		fetchUserLogin,
		{
			// Opsi untuk SWR
			shouldRetryOnError: false, // Jangan coba lagi jika ada error (misal, 403)
			revalidateOnFocus: false, // Tidak perlu re-fetch saat window focus
		}
	);

	const isPublicPage = ["/login", "/sign-up"].includes(pathname);

	useEffect(() => {
		// Jika loading, jangan lakukan apa-apa
		if (isLoading) return;

		// Jika ada error (user tidak terautentikasi) dan kita berada di halaman yang dilindungi
		if (error && !isPublicPage) {
			router.push("/login");
		}

		// Jika user berhasil login dan mencoba mengakses halaman login/signup
		if (user && isPublicPage) {
			router.push("/dashboard");
		}
	}, [user, error, isLoading, isPublicPage, router]);

	// Selama loading atau jika kita di halaman publik, tampilkan children
	// Ini mencegah "flicker" ke halaman login saat me-refresh halaman yang dilindungi
	if (isLoading && !isPublicPage) {
		// Anda bisa menampilkan komponen skeleton/loading di sini
		return <div>Loading session...</div>;
	}

	return <AuthContext.Provider value={{ user, isLoading, error }}>{children}</AuthContext.Provider>;
}
