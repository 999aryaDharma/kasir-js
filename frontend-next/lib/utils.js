import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
	return twMerge(clsx(inputs));
}

export const formatCurrency = (amount) => {
	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		minimumFractionDigits: 0,
	}).format(amount);
};

// Format relative time berdasarkan timezone client
export const formatTimeAgo = (date) => {
	// Pastikan date adalah Date object, gunakan timezone client
	const dateObj = new Date(date);
	const now = new Date();

	// Hitung selisih dalam milliseconds, lalu convert ke seconds
	const seconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

	// Handle edge cases
	if (seconds < 0 || isNaN(seconds)) return "Baru saja";

	if (seconds < 60) return "Baru saja";
	if (seconds < 3600) return `${Math.floor(seconds / 60)} menit lalu`;
	if (seconds < 86400) return `${Math.floor(seconds / 3600)} jam lalu`;
	if (seconds < 604800) return `${Math.floor(seconds / 86400)} hari lalu`;

	// Lebih dari seminggu, tampilkan tanggal
	return dateObj.toLocaleDateString("id-ID", {
		day: "numeric",
		month: "short",
	});
};
