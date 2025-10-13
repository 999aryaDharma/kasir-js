/** @type {import('next').NextConfig} */
const nextConfig = {
	webpack: (config) => {
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
		return config;
	},
	// Additional configuration for better Docker compatibility
	env: {
		NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
	},
};

export default nextConfig;
