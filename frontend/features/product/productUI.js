import { state, subscribe } from "../../core/state.js";
import { deleteProductById } from "./productService.js";

export function renderProductList() {
	const ol = document.getElementById("product-list");
	ol.innerHTML = "";
	state.products.forEach((product) => {
		const li = document.createElement("li");
		li.innerHTML = `
      <span>${product.name}</span>
      <div>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </div>
    `;
		li.querySelector(".edit-btn").addEventListener("click", () => window.handleEditProduct(product));
		li.querySelector(".delete-btn").addEventListener("click", () => {
			if (window.confirm(`Apakah Anda yakin ingin menghapus produk "${product.name}"?`)) {
				deleteProductById(product.id);
			}
		});
		ol.appendChild(li);
	});
}

// subscribe UI ke state
subscribe(() => renderProductList());
