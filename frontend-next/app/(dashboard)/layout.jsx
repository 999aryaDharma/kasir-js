import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

// TAMBAHKAN BARIS INI:
// Baris ini memberitahu Next.js untuk selalu me-render halaman ini secara dinamis
// di server pada saat ada permintaan, bukan menjadikannya file statis.
export const dynamic = "force-dynamic";

export default function DashboardLayout({ children }) {
	return (
		// Mengubah ini menjadi flexbox kolom dengan tinggi layar penuh
		<div className="flex h-screen overflow-hidden bg-gray-50">
			<Sidebar />
			{/* Menambahkan overflow-y-auto di sini untuk menjadi container scroll utama */}
			{/* Kontainer untuk Header dan Konten Utama */}
			<div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
				<div className="pt-1  top-0 z-10 bg-gray-50 shadow-sm">
					<Header />
				</div>
				{/* Area konten utama yang bisa di-scroll */}
				<main className="flex-1 p-8">{children}</main>
			</div>
		</div>
	);
}
