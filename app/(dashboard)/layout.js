@@ .. @@
 import Sidebar from "@/components/layout/Sidebar";
+import Header from "@/components/layout/Header";
 
 // TAMBAHKAN BARIS INI:
@@ .. @@
 export default function DashboardLayout({ children }) {
 	return (
 		<div className="flex min-h-screen">
 			<Sidebar />
-			<main className="flex-1 p-8 bg-gray-50">{children}</main>
+			<div className="flex-1 flex flex-col">
+				<Header />
+				<main className="flex-1 p-8 bg-gray-50">{children}</main>
+			</div>
 		</div>
 	);
 }