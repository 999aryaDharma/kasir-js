const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
	console.log("Start seeding...");

	// 1. Buat user Admin
	const hashedPassword = await bcrypt.hash("admin128", 10);
	const adminUser = await prisma.user.upsert({
		where: { username: "admin" },
		update: {},
		create: {
			username: "admin",
			password: hashedPassword,
			role: 1, // 1 = admin
		},
	});
	console.log(`✅ Created/found admin user: ${adminUser.username}`);

	// 2. Buat Kategori
	const categoriesData = [{ name: "Makanan Ringan" }, { name: "Minuman" }, { name: "Kebutuhan Pokok" }, { name: "Perawatan Diri" }, { name: "Pembersih Rumah" }, { name: "Obat-obatan" }, { name: "Roti & Kue" }];

	await prisma.category.createMany({
		data: categoriesData,
		skipDuplicates: true,
	});
	console.log("✅ Categories created/verified.");

	const categories = await prisma.category.findMany();
	const categoryMap = categories.reduce((acc, category) => {
		acc[category.name] = category.id;
		return acc;
	}, {});

	// 3. Hapus produk lama dan buat produk baru
	console.log("🔄 Deleting old products...");
	await prisma.product.deleteMany({});

	const productsData = [
		// Makanan Ringan
		{ name: "Chitato Sapi Panggang 68g", costPrice: 8000, sellingPrice: 10500, cat: "Makanan Ringan" },
		{ name: "Lays Rumput Laut 68g", costPrice: 8500, sellingPrice: 11000, cat: "Makanan Ringan" },
		{ name: "Oreo Original 137g", costPrice: 7000, sellingPrice: 9500, cat: "Makanan Ringan" },
		{ name: "Taro Net 36g", costPrice: 4000, sellingPrice: 5000, cat: "Makanan Ringan" },
		{ name: "Silverqueen 65g", costPrice: 10000, sellingPrice: 13500, cat: "Makanan Ringan" },

		// Minuman
		{ name: "Coca-Cola Kaleng 330ml", costPrice: 4500, sellingPrice: 6000, cat: "Minuman" },
		{ name: "Aqua Botol 600ml", costPrice: 2500, sellingPrice: 3500, cat: "Minuman" },
		{ name: "Teh Botol Sosro Kotak 250ml", costPrice: 3000, sellingPrice: 4000, cat: "Minuman" },
		{ name: "Ultra Milk Coklat 250ml", costPrice: 4500, sellingPrice: 6000, cat: "Minuman" },
		{ name: "Pocari Sweat 500ml", costPrice: 6000, sellingPrice: 8000, cat: "Minuman" },

		// Kebutuhan Pokok
		{ name: "Indomie Goreng", costPrice: 2500, sellingPrice: 3000, cat: "Kebutuhan Pokok" },
		{ name: "Beras Sania 5kg", costPrice: 60000, sellingPrice: 68000, cat: "Kebutuhan Pokok" },
		{ name: "Minyak Goreng Bimoli 2L", costPrice: 35000, sellingPrice: 40000, cat: "Kebutuhan Pokok" },
		{ name: "Gula Gulaku 1kg", costPrice: 12000, sellingPrice: 14500, cat: "Kebutuhan Pokok" },
		{ name: "Telur Ayam Negeri (per butir)", costPrice: 1800, sellingPrice: 2500, cat: "Kebutuhan Pokok" },

		// Perawatan Diri
		{ name: "Sabun Lifebuoy Total 10", costPrice: 3000, sellingPrice: 4500, cat: "Perawatan Diri" },
		{ name: "Shampoo Pantene 135ml", costPrice: 15000, sellingPrice: 18000, cat: "Perawatan Diri" },
		{ name: "Pepsodent Putih 190g", costPrice: 8000, sellingPrice: 10000, cat: "Perawatan Diri" },
		{ name: "Rexona Men Ice Cool 45ml", costPrice: 12000, sellingPrice: 15000, cat: "Perawatan Diri" },

		// Pembersih Rumah
		{ name: "Sunlight Jeruk Nipis 750ml", costPrice: 13000, sellingPrice: 15000, cat: "Pembersih Rumah" },
		{ name: "Rinso Anti Noda 770g", costPrice: 18000, sellingPrice: 21000, cat: "Pembersih Rumah" },
		{ name: "Wipol Karbol 780ml", costPrice: 10000, sellingPrice: 12500, cat: "Pembersih Rumah" },

		// Obat-obatan
		{ name: "Panadol Biru (strip)", costPrice: 8000, sellingPrice: 10000, cat: "Obat-obatan" },
		{ name: "Tolak Angin Cair (sachet)", costPrice: 2500, sellingPrice: 3500, cat: "Obat-obatan" },
		{ name: "Hansaplast (strip)", costPrice: 5000, sellingPrice: 7000, cat: "Obat-obatan" },

		// Roti & Kue
		{ name: "Sari Roti Sobek Coklat", costPrice: 10000, sellingPrice: 13000, cat: "Roti & Kue" },
		{ name: "Aoka Roti Panggang", costPrice: 2000, sellingPrice: 2500, cat: "Roti & Kue" },
	];

	const productsToCreate = productsData.map((product, index) => {
		const categoryId = categoryMap[product.cat];
		const categoryPart = String(categoryId).padStart(3, "0");
		const randomPart = String(index + 1).padStart(3, "0"); // Gunakan index untuk kode unik
		const generatedCode = `${categoryPart}-${randomPart}`;

		return {
			name: product.name,
			code: generatedCode,
			costPrice: product.costPrice, // Menggunakan nama yang benar
			sellingPrice: product.sellingPrice, // Menggunakan nama yang benar
			stock: Math.floor(Math.random() * 100) + 20,
			categoryId: categoryId,
		};
	});

	await prisma.product.createMany({
		data: productsToCreate,
	});

	console.log(`✅ ${productsToCreate.length} products created.`);
	console.log("Seeding finished. 🎉");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
