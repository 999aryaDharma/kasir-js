import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

// TAMBAHKAN BARIS INI:
// Baris ini memberitahu Next.js untuk selalu me-render halaman ini secara dinamis
// di server pada saat ada permintaan, bukan menjadikannya file statis.
export const dynamic = "force-dynamic";

export default function DashboardLayout({ children }) {
	return (
		<div className="flex min-h-screen">
			<Sidebar />
			<div className="flex flex-col flex-1">
				<Header />
				<main className="flex-1 p-8 bg-gray-50">{children}</main>
			</div>
		</div>
	);
}
