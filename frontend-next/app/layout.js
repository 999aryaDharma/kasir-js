import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/auth/SessionProvider";
import { CartProvider } from "@/app/cart/cartState.js";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "Kasir POS",
	description: "Aplikasi Point of Sale Sederhana",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<SessionProvider>
					<CartProvider>{children}</CartProvider>
				</SessionProvider>
			</body>
		</html>
	);
}
