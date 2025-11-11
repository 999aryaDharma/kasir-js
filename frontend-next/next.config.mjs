/** @type {import('next').NextConfig} */
const nextConfig = {
	webpack: (config, { isServer }) => {
		// Konfigurasi ini memaksa Next.js untuk secara aktif
		// memeriksa perubahan file, yang sangat andal untuk Docker.
		config.watchOptions = {
			poll: 500, // Periksa perubahan setiap 500 milidetik (0.5 detik) - lebih cepat
			aggregateTimeout: 300, // Tunda rebuild selama 300 milidetik setelah perubahan
			ignored: [
				'**/.git/**',
				'**/node_modules/**',
				'**/.next/**',
				'**/dist/**'
			]
		};
		
		// Konfigurasi optimization untuk bundle splitting
		if (!isServer) {
			config.optimization.splitChunks = {
				chunks: 'all',
				cacheGroups: {
					// Vendor bundle untuk library eksternal
					vendor: {
						test: /[\\/]node_modules[\\/]/,
						name: 'vendors',
						chunks: 'all',
						priority: 10,
						enforce: true,
					},
					// Shared chunks untuk komponen yang digunakan di banyak tempat
					shared: {
						minChunks: 2,
						name: 'shared',
						chunks: 'all',
						priority: 5,
						enforce: true,
					},
					// React-related dependencies
					reactVendor: {
						test: /[\\/]node_modules[\\/](react|react-dom|react-is|scheduler)[\\/]/,
						name: 'react-vendor',
						chunks: 'all',
						priority: 20,
					},
					// UI library dependencies
					uiVendor: {
						test: /[\\/]node_modules[\\/](@radix-ui|lucide-react)[\\/]/,
						name: 'ui-vendor',
						chunks: 'all',
						priority: 15,
					},
					// Data fetching and state management
					dataVendor: {
						test: /[\\/]node_modules[\\/](swr|@tanstack)[\\/]/,
						name: 'data-vendor',
						chunks: 'all',
						priority: 15,
					}
				}
			};
		}
		
		return config;
	},
	// Additional configuration for better Docker compatibility and performance
	env: {
		NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
	},
	// Additional Next.js optimizations
	reactStrictMode: true,
	productionBrowserSourceMaps: true,
	images: {
		dangerouslyAllowSVG: true,
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
	},
};

export default nextConfig;