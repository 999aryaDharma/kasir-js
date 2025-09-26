import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

// TAMBAHKAN BARIS INI:
// Baris ini memberitahu Next.js untuk selalu me-render halaman ini secara dinamis
// di server pada saat ada permintaan, bukan menjadikannya file statis.
export const dynamic = "force-dynamic";

export default function DashboardLayout({ children }) {
	return (
		<div className="flex min-h-screen">
			<Sidebar />
			<div className="flex-1 flex flex-col">
				<Header />
				<main className="flex-1 p-12 bg-gray-50">{children}</main>
			</div>
		</div>
	);
}
