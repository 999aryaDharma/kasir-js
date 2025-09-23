import { API_BASE_URL } from "./config.js";

const form = document.getElementById("category-form");
const categoryIdInput = document.getElementById("category-id");
const categoryNameInput = document.getElementById("category-name");
const categoryList = document.getElementById("category-list");
const cancelBtn = document.getElementById("cancel-edit-btn");

const resetForm = () => {
	categoryIdInput.value = "";
	categoryNameInput.value = "";
	cancelBtn.style.display = "none";
	categoryNameInput.focus();
};

// --- FUNGSI UTAMA ---
// 1. Ambil dan tampilkan semua kategori
export async function fetchCategories() {
	try {
		const response = await fetch(`${API_BASE_URL}/categories`);
		const responseData = await response.json();
		const categories = responseData.data || [];

		// render ke UL
		const categoryList = document.getElementById("category-list");
		categoryList.innerHTML = "";
		categories.forEach((cat) => {
			const li = document.createElement("li");
			li.innerHTML = `
        <span>${cat.name}</span>
        <div>
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Delete</button>
        </div>
      `;
			li.querySelector(".edit-btn").addEventListener("click", () => editCategory(cat.id, cat.name));
			li.querySelector(".delete-btn").addEventListener("click", () => deleteCategory(cat.id));
			categoryList.appendChild(li);
		});

		// ✅ penting: kembalikan data
		return categories;
	} catch (error) {
		console.error("Error fetching categories:", error);
		return [];
	}
}

// 2. Event listener untuk form (Create & Update)
form.addEventListener("submit", async (e) => {
	e.preventDefault();
	const id = categoryIdInput.value;
	const name = categoryNameInput.value;

	const method = id ? "PUT" : "POST";
	const url = id ? `${API_BASE_URL}/categories/${id}` : `${API_BASE_URL}/categories`;

	try {
		const response = await fetch(url, {
			method,
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name }),
		});

		const result = await response.json();

		if (!result.success) {
			throw new Error(result.message || `HTTP Error! Status: ${response.status}`);
		}

		resetForm();
		await fetchCategories(); // reload list
		document.dispatchEvent(new Event("categoriesUpdated"));
	} catch (error) {
		console.error("Error saving category:", error.message);
		alert(`Gagal menyimpan kategori: ${error.message}`);
	}
});

// Tombol batal
cancelBtn.addEventListener("click", resetForm);

// --- FUNGSI BANTUAN ---
window.editCategory = (id, name) => {
	categoryIdInput.value = id;
	categoryNameInput.value = name;
	cancelBtn.style.display = "inline";
};

window.deleteCategory = async (id) => {
	if (confirm("Yakin ingin menghapus kategori ini?")) {
		try {
			await fetch(`${API_BASE_URL}/categories/${id}`, { method: "DELETE" });
			await fetchCategories();
			document.dispatchEvent(new Event("categoriesUpdated"));
		} catch (error) {
			console.error("Error deleting category:", error);
		}
	}
};

// Panggil saat halaman load
fetchCategories();
