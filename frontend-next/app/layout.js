import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/auth/SessionProvider";
import { CartProvider } from "@/app/pos/cart/CartState";
import { TokenInjector } from "@/components/auth/TokenInjector";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Kasir POS",
  description: "Aplikasi Point of Sale Sederhana",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to critical origins */}
        <link rel="preconnect" href="http://localhost:3000" />
        <link rel="dns-prefetch" href="http://localhost:3000" />
        
        {/* Preload critical fonts */}
        <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
        <SessionProvider>
          <TokenInjector>
            <CartProvider>
              {children}
              <Toaster richColors position="top-right" />
            </CartProvider>
          </TokenInjector>
        </SessionProvider>
      </body>
    </html>
  );
}
