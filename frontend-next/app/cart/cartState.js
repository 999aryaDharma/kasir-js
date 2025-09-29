"use client";

import React, { createContext, useReducer, useContext } from "react";

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
					items: state.items.map((item) =>
						item.id === action.payload.id
							? { ...item, quantity: item.quantity + 1 }
							: item
					),
				};
			} else {
				// Jika item baru, tambahkan ke keranjang
				const newItem = { ...action.payload, quantity: 1 };
				return { ...state, items: [...state.items, newItem] };
			}
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
		// Anda bisa menambahkan case lain seperti UPDATE_QUANTITY, dll.
		default: {
			throw new Error(`Unhandled action type: ${action.type}`);
		}
	}
};

const initialState = {
	items: [],
};

export const CartProvider = ({ children }) => {
	const [state, dispatch] = useReducer(cartReducer, initialState);

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
}
