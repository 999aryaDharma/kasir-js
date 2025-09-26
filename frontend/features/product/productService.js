import { apiGet, apiPut, apiDelete, apiPost } from "../../core/api.js";
import { addProduct, state, subscribe, updateProductInState, setProducts, removeProduct } from "../../core/state.js";

export function renderCategoryDropdown() {
	const dropdown = document.getElementById("product-category");
	dropdown.innerHTML = "";
	state.categories.forEach((cat) => {
		const option = document.createElement("option");
		option.value = cat.id;
		option.textContent = cat.name;
		dropdown.appendChild(option);
	});
}

export async function fetchProducts() {
	const data = await apiGet("products");
	setProducts(data.data);
}

export function getCategoryId(id) {
	return state.categories.find((cat) => cat.id === id);
}

function generateProductCode(categoryId) {
	// Ambil 3 digit dari categoryId, pad dengan '0' di kiri jika perlu
	const prefix = String(categoryId).padStart(3, "0");

	// Buat angka random 3 digit
	const randomPart = Math.floor(Math.random() * 1000);
	const randomString = String(randomPart).padStart(3, "0");

	// Gabungkan
	return `${prefix}-${randomString}`;
}

export async function createProduct(productData) {
	const code = generateProductCode(productData.categoryId);
	const dataToSave = { ...productData, code };
	const result = await apiPost("products", dataToSave);
	if (result.data) addProduct(result.data);
}

export async function updateProduct(productData) {
	const data = await apiPut(`products/${productData.id}`, productData);
	if (data.data) updateProductInState(data.data);
}

export async function deleteProductById(id) {
	await apiDelete(`products/${id}`);
	removeProduct(id);
}

// subscribe UI ke state
subscribe(() => renderCategoryDropdown());
