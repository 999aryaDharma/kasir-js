/** @type {import('next').NextConfig} */
const nextConfig = {
	webpack: (config) => {
		// Konfigurasi ini memaksa Next.js untuk secara aktif
		// memeriksa perubahan file, yang sangat andal untuk Docker.
		config.watchOptions = {
			poll: 1000, // Periksa perubahan setiap 1000 milidetik (1 detik)
			aggregateTimeout: 300, // Tunda rebuild selama 300 milidetik setelah perubahan
		};
		return config;
	},
};

export default nextConfig;
