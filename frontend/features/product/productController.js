import { fetchProducts, createProduct, updateProduct } from "./productService.js";
import "./productUI.js";

export async function initProductController() {
	const form = document.getElementById("product-form");
	const productIdInput = document.getElementById("product-id");
	const productNameInput = document.getElementById("product-name");
	const productStockInput = document.getElementById("product-stock");
	const costPriceInput = document.getElementById("costPrice");
	const sellingPriceInput = document.getElementById("sellingPrice");
	const categoryDropdown = document.getElementById("product-category");
	const cancelBtn = document.getElementById("product-cancel-btn");

	const resetForm = () => {
		form.reset();
		productIdInput.value = "";
		cancelBtn.style.display = "none";
	};

	form.addEventListener("submit", async (e) => {
		e.preventDefault();

		// 1. Ambil data TERBARU dari form saat submit
		const productData = {
			id: productIdInput.value,
			name: productNameInput.value,
			stock: parseInt(productStockInput.value, 10) || 0,
			costPrice: parseFloat(costPriceInput.value) || 0,
			sellingPrice: parseFloat(sellingPriceInput.value) || 0,
			categoryId: parseInt(categoryDropdown.value, 10),
		};

		try {
			if (productData.id) {
				// Update: Kirim semua data termasuk ID
				await updateProduct(productData);
				alert("Produk berhasil diperbarui!");
			} else {
				// Create: Kirim data tanpa ID
				const { id, ...dataToCreate } = productData;
				await createProduct(dataToCreate);
				alert("Produk berhasil ditambahkan!");
			}
			resetForm();
		} catch (error) {
			console.error("Gagal menyimpan produk:", error);
			alert("Gagal menyimpan produk. Cek konsol untuk detail.");
		}
	});

	// 2. Terima seluruh objek 'product'
	window.handleEditProduct = (product) => {
		// 3. Isi form dengan data dari objek 'product' yang dikirim
		productIdInput.value = product.id;
		productNameInput.value = product.name;
		productStockInput.value = product.stock || 0;
		costPriceInput.value = product.costPrice || 0;
		sellingPriceInput.value = product.sellingPrice || 0;
		categoryDropdown.value = product.categoryId;
		cancelBtn.style.display = "inline-block";
		productNameInput.focus();
	};

	cancelBtn.addEventListener("click", resetForm);
	fetchProducts();
}
