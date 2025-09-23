import { createCategory, fetchCategories, updateCategory, deleteCategoryById } from "./categoryService.js";
import "./categoryUI.js";

export function initCategoryController() {
	const form = document.getElementById("category-form");
	const categoryIdInput = document.getElementById("category-id");
	const categoryNameInput = document.getElementById("category-name");
	const cancelBtn = document.getElementById("cancel-edit-btn");

	const resetForm = () => {
		form.reset();
		categoryIdInput.value = "";
		cancelBtn.style.display = "none";
	};

	form.addEventListener("submit", async (e) => {
		e.preventDefault();
		const id = categoryIdInput.value;
		const name = categoryNameInput.value;

		if (id) {
			// Update
			await updateCategory(id, name);
		} else {
			// Create
			await createCategory(name);
		}
		resetForm();
	});

	window.handleEditCategory = (id, name) => {
		categoryIdInput.value = id;
		categoryNameInput.value = name;
		cancelBtn.style.display = "inline-block";
		categoryNameInput.focus();
	};

	cancelBtn.addEventListener("click", resetForm);

	fetchCategories();
}
