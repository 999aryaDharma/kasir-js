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

	const isPublicPage = ["/login", "/sign-up"].includes(pathname);

	// Helper untuk memeriksa apakah ada accessToken di localStorage
	// Ini akan digunakan untuk menentukan apakah SWR harus mencoba fetch atau tidak
	const hasAccessToken = typeof window !== "undefined" && localStorage.getItem("accessToken");

	const {
		data: user,
		error,
		isLoading,
		mutate, // Ambil `mutate` dari useSWR di sini
	} = useSWR(
		// Selalu coba fetch /auth/me jika ada accessToken di localStorage,
		// atau jika kita berada di halaman terproteksi (untuk memicu refresh jika perlu).
		// Jika tidak ada accessToken dan di halaman publik, tidak perlu fetch.
		hasAccessToken || !isPublicPage ? "/auth/me" : null,
		fetchUserLogin,
		{
			shouldRetryOnError: false,
			revalidateOnFocus: false,
			revalidateOnReconnect: false,
			revalidateIfStale: false, // Mencegah revalidasi otomatis saat komponen mount
		}
	);

	useEffect(() => {
		// Jangan lakukan apa-apa jika SWR masih dalam proses loading awal.
		// Ini mencegah redirect yang tidak perlu sebelum status auth diketahui.
		if (isLoading) return;

		// Jika tidak ada data user DAN tidak ada error (misalnya saat load awal di halaman terproteksi),
		// kita panggil mutate() untuk memicu fetch manual. Ini memberi kesempatan pada
		// proses refresh token untuk berjalan jika diperlukan.
		if (!user && !error && !isPublicPage) {
			mutate();
		}

		// Kondisi 1: Terjadi error saat fetch user (misal: token tidak valid, kadaluwarsa, atau tidak ada)
		// dan user sedang mencoba mengakses halaman yang dilindungi.
		if (error && !isPublicPage) {
			// Opsional: bersihkan token yang sudah tidak valid dari storage
			// refreshToken tidak ada di localStorage, jadi kita hanya perlu hapus accessToken.
			localStorage.removeItem("accessToken");
			router.push("/login");
		}

		// Kondisi 2: Data user berhasil didapatkan (artinya user sudah login)
		// dan user sedang berada di halaman publik (login/sign-up).
		if (user && isPublicPage) {
			router.push("/dashboard");
		}
	}, [user, error, isLoading, isPublicPage, router, mutate]);

	// Tampilkan layar loading jika kita belum tahu status login user (isLoading)
	// dan user sedang berada di halaman yang dilindungi. Ini mencegah "kedipan" halaman login.
	if (isLoading && !isPublicPage) {
		return <div>Loading session...</div>;
	}

	return <AuthContext.Provider value={{ user, isLoading, error }}>{children}</AuthContext.Provider>;
}
