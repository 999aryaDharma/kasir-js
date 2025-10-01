import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

// TAMBAHKAN BARIS INI:
// Baris ini memberitahu Next.js untuk selalu me-render halaman ini secara dinamis
// di server pada saat ada permintaan, bukan menjadikannya file statis.
export const dynamic = "force-dynamic";

export default function DashboardLayout({ children }) {
	return (
		// Mengubah ini menjadi flexbox kolom dengan tinggi layar penuh
		<div className="flex h-screen bg-gray-50">
			<Sidebar />
			{/* Menambahkan overflow-y-auto di sini untuk menjadi container scroll utama */}
			<div className="flex-1 flex flex-col">
				<Header />
				{/* Konten utama sekarang memiliki padding dan akan di-scroll oleh parent-nya */}
				<main className="flex-1 overflow-y-auto p-8">{children}</main>
			</div>
		</div>
	);
}
