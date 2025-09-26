import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/auth/SessionProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "Kasir POS",
	description: "Aplikasi Point of Sale Sederhana",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<SessionProvider>{children}</SessionProvider>
			</body>
		</html>
	);
}
