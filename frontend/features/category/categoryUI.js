import { state, subscribe } from "../../core/state.js";
import { deleteCategoryById } from "./categoryService.js";

export function renderCategoryList() {
	const ol = document.getElementById("category-list");
	ol.innerHTML = "";
	state.categories.forEach((cat) => {
		const li = document.createElement("li");
		li.innerHTML = `
      <span>${cat.name}</span>
      <div>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </div>
    `;
		li.querySelector(".edit-btn").addEventListener("click", () => window.handleEditCategory(cat.id, cat.name));
		li.querySelector(".delete-btn").addEventListener("click", () => {
			if (window.confirm(`Apakah Anda yakin ingin menghapus kategori "${cat.name}"?`)) {
				deleteCategoryById(cat.id);
			}
		});
		ol.appendChild(li);
	});
}

// subscribe UI ke state
subscribe(() => renderCategoryList());
