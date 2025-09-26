import { redirect } from "next/navigation";

export default function HomePage() {
	// Redirect ini terjadi di sisi server
	redirect("/login");

	// Karena redirect terjadi, bagian return ini tidak akan pernah di-render.
	// Tapi kita tetap bisa menambahkannya untuk kelengkapan.
	return null;
}
