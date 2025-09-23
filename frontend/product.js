import { API_BASE_URL } from "./config.js";
import { fetchCategories } from "./category.js";

const dropdownCategory = document.getElementById("product-category");

export async function fetchCategoriesForDropdown() {
	try {
		const categories = await fetchCategories();

		dropdownCategory.innerHTML = "";
		categories.forEach((cat) => {
			const option = document.createElement("option");
			option.value = cat.id;
			option.textContent = cat.name;
			dropdownCategory.appendChild(option);
		});
	} catch (error) {
		console.error("Error fetching categories for dropdown:", error);
	}
}

// listen event dari category.js
document.addEventListener("categoriesUpdated", fetchCategoriesForDropdown);

// Panggil saat halaman load
fetchCategoriesForDropdown();
