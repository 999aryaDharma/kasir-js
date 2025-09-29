import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

// TAMBAHKAN BARIS INI:
// Baris ini memberitahu Next.js untuk selalu me-render halaman ini secara dinamis
// di server pada saat ada permintaan, bukan menjadikannya file statis.
export const dynamic = "force-dynamic";

export default function DashboardLayout({ children }) {
	return (
		// Batasi tinggi layout ke tinggi layar dan sembunyikan overflow di level ini
		<div className="flex h-screen overflow-hidden bg-gray-100">
			<Sidebar />
			{/* Kontainer utama untuk header dan konten */}
			<div className="flex flex-1 flex-col overflow-hidden">
				<Header />
				{/* Area konten utama yang bisa di-scroll */}
				<main className="flex-1 overflow-y-auto p-8">{children}</main>
			</div>
		</div>
	);
}
