import { apiGet, apiPost, apiPut, apiDelete } from "../../core/api.js";
import { setCategories, addCategory, updateCategoryInState, removeCategory } from "../../core/state.js";

export async function fetchCategories() {
	const data = await apiGet("categories");
	setCategories(data.data);
}

export async function createCategory(name) {
	const data = await apiPost("categories", { name });
	if (data.data) addCategory(data.data);
}

export async function updateCategory(id, name) {
	const data = await apiPut(`categories/${id}`, { name });
	if (data.data) updateCategoryInState(data.data);
}

export async function deleteCategoryById(id) {
	await apiDelete(`categories/${id}`);
	removeCategory(id);
}
