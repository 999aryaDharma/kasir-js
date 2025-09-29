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

	const {
		data: user,
		error,
		isLoading,
	} = useSWR(
		// Selalu coba fetch data user, SWR akan berhenti jika fetcher melempar error atau null
		"/auth/me",
		fetchUserLogin,
		{
			shouldRetryOnError: false,
			revalidateOnFocus: false,
		}
	);

	const isPublicPage = ["/login", "/sign-up"].includes(pathname);

	useEffect(() => {
		// Jangan lakukan apa-apa jika SWR masih dalam proses loading awal.
		// Ini mencegah redirect yang tidak perlu sebelum status auth diketahui.
		if (isLoading) return;

		// Kondisi 1: Terjadi error saat fetch user (misal: token tidak valid, kadaluwarsa, atau tidak ada)
		// dan user sedang mencoba mengakses halaman yang dilindungi.
		if (error && !isPublicPage) {
			// Opsional: bersihkan token yang sudah tidak valid dari storage
			localStorage.removeItem("accessToken");
			localStorage.removeItem("refreshToken");
			router.push("/login");
		}

		// Kondisi 2: Data user berhasil didapatkan (artinya user sudah login)
		// dan user sedang berada di halaman publik (login/sign-up).
		if (user && isPublicPage) {
			router.push("/dashboard");
		}
	}, [user, error, isLoading, isPublicPage, router]);

	// Tampilkan layar loading jika kita belum tahu status login user (isLoading)
	// dan user sedang berada di halaman yang dilindungi. Ini mencegah "kedipan" halaman login.
	if (isLoading && !isPublicPage) {
		return <div>Loading session...</div>;
	}

	return <AuthContext.Provider value={{ user, isLoading, error }}>{children}</AuthContext.Provider>;
}
