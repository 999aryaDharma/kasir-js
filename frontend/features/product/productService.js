import { state, subscribe } from "../../core/state.js";

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

export function getCategoryId(id) {
  return state.categories.find((cat) => cat.id === id);
}

export async function createProduct(){
  const data = await apiPost("products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ body })
  })
}

// subscribe UI ke state
subscribe(() => renderCategoryDropdown());
