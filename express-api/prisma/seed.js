const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
	console.log("Start seeding ...");

	// 1. Buat kategori default jika belum ada
	const generalCategory = await prisma.category.upsert({
		where: { name: "General" },
		update: {},
		data: {
			name: "General",
		},
		create: {
			name: "General",
		},
	});

	console.log(`Created/found category: ${generalCategory.name}`);

	// 2. Tambahkan produk awal
	await prisma.product.create({
		data: {
			name: "Produk Contoh",
			code: "P001",
			costPrice: 10000,
			sellingPrice: 15000,
			categoryId: generalCategory.id,
		},
	});

	console.log("Seeding finished.");
}

main()
	.catch((e) => console.error(e))
	.finally(async () => await prisma.$disconnect());
