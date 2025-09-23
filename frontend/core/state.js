export const state = {
	categories: [],
	products: [],
	listeners: [],
};

export function subscribe(listener) {
	state.listeners.push(listener);
}

function notify() {
	state.listeners.forEach((l) => l(state));
}

export function setCategories(newCategories) {
	state.categories = newCategories;
	notify();
}

export function addCategory(newCategory) {
	state.categories.push(newCategory);
	notify();
}

export function updateCategoryInState(updatedCategory) {
	state.categories = state.categories.map((c) => (c.id === updatedCategory.id ? updatedCategory : c));
	notify();
}

export function removeCategory(id) {
	state.categories = state.categories.filter((cat) => cat.id !== id);
	notify();
}

export function setProducts(newProducts) {
	state.products = newProducts;
	notify();
}

export function addProduct(newProduct) {
	state.products.push(newProduct);
	notify();
}

export function updateProductInState(updatedProduct) {
	state.products = state.products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p));
	notify();
}

export function removeProduct(id) {
	state.products = state.products.filter((p) => p.id !== id);
	notify();
}
