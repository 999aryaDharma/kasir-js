"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";

export function TokenInjector({ children }) {
	const pathname = usePathname();

	useEffect(() => {
		const token = Cookies.get("accessToken");
		if (token) {
			const originalFetch = window.fetch;
			window.fetch = function (url, options = {}) {
				// Pastikan options.headers ada
				const headers = options.headers || {};

				// Buat object options baru untuk menghindari mutasi
				const newOptions = {
					...options,
					headers: {
						...headers,
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
					credentials: "include", // Penting untuk cookies
				};

				return originalFetch(url, newOptions);
			};

			// Cleanup function untuk mengembalikan fetch asli
			return () => {
				window.fetch = originalFetch;
			};
		}
	}, [pathname]);

	return children;
}
