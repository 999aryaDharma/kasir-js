"use client";

import { createContext, useContext, useEffect } from "react";
import { usePathname } from "next/navigation";
import useSWR from "swr";
import { fetchUserProfile } from "@/lib/api";

const AuthContext = createContext();

export function useAuth() {
	return useContext(AuthContext);
}

export function SessionProvider({ children }) {
	const pathname = usePathname();
	const isPublicPage = ["/login", "/sign-up"].includes(pathname);

	// Middleware sudah menangani proteksi rute.
	// SessionProvider sekarang hanya bertugas menyediakan data user ke seluruh aplikasi.
	const {
		data: user,
		error,
		isLoading,
	} = useSWR(
		isPublicPage ? null : "/auth/me", 
		fetchUserProfile,
		{
			// Opsi SWR bisa disesuaikan, ini contoh yang baik
			revalidateOnFocus: true,
			revalidateIfStale: true,
			shouldRetryOnError: false, // apiFetch sudah menangani refresh, jadi jangan retry di sini
		}
	);

	return <AuthContext.Provider value={{ user, isLoading, error }}>{children}</AuthContext.Provider>;
}
