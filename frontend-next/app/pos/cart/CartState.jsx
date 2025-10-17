"use client";

import React, { createContext, useReducer, useContext, useEffect } from "react";

const CartStateContext = createContext();
const CartDispatchContext = createContext();

const cartReducer = (state, action) => {
	switch (action.type) {
		case "ADD_ITEM": {
			const existingItemIndex = state.items.findIndex((item) => item.id === action.payload.id);
			if (existingItemIndex > -1) {
				// Jika item sudah ada, tambahkan quantity
				return {
					...state,
					items: state.items.map((item) => (item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item)),
				};
			} else {
				// Jika item baru, tambahkan ke keranjang
				const newItem = { ...action.payload, quantity: 1 };
				return { ...state, items: [...state.items, newItem] };
			}
		}
		case "UPDATE_QUANTITY": {
			const currentQuantity = action.payload.quantityChange;
			return {
				...state,
				items: state.items.map((item) => (item.id === action.payload.id ? { ...item, quantity: item.quantity + currentQuantity } : item)).filter((item) => item.quantity > 0), // Hapus item jika quantity menjadi 0 atau kurang
			};
		}
		case "REMOVE_ITEM": {
			return {
				...state,
				items: state.items.filter((item) => item.id !== action.payload.id),
			};
		}
		case "CLEAR_CART": {
			return { ...state, items: [] };
		}

		case "INITIALIZE_CART": {
			return action.payload;
		}
		// Anda bisa menambahkan case lain seperti UPDATE_QUANTITY, dll.
		default: {
			throw new Error(`Unhandled action type: ${action.type}`);
		}
	}
};

const getInitialCartState = () => {
	if (typeof window !== "undefined") {
		try {
			const storeCart = sessionStorage.getItem("cart");
			if (storeCart) {
				return JSON.parse(storeCart);
			}
		} catch (error) {
			console.error("Failed to parse cart from sessionStorage:", error);
			return { items: [] };
		}
	}
	return { items: [] }; // Default state jika SSR atau tidak ada di sessionStorage
};

export const CartProvider = ({ children }) => {
	const [state, dispatch] = useReducer(cartReducer, getInitialCartState());

	useEffect(() => {
		try {
			sessionStorage.setItem("cart", JSON.stringify(state));
		} catch (error) {
			console.error("Failed to save cart to sessionStorage:", error);
		}
	}, [state]); // Dependensi [state] memastikan ini berjalan hanya saat state berubah

	return (
		<CartStateContext.Provider value={state}>
			<CartDispatchContext.Provider value={dispatch}>{children}</CartDispatchContext.Provider>
		</CartStateContext.Provider>
	);
};

// Custom hooks untuk menggunakan state dan dispatch dengan mudah
export const useCartState = () => {
	const context = useContext(CartStateContext);
	if (context === undefined) {
		throw new Error("useCartState must be used within a CartProvider");
	}
	return context;
};

export const useCartDispatch = () => {
	const context = useContext(CartDispatchContext);
	if (context === undefined) {
		throw new Error("useCartDispatch must be used within a CartProvider");
	}
	return context;
};
