import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// ====================== TYPES ======================
export interface CartItem {
    menuId: string;
    name: string;
    price: number;
    imageUrl: string | null;
    quantity: number;
}

interface CartState {
    items: CartItem[];
}

const initialState: CartState = {
    items: [],
};

// ====================== SLICE ======================
const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        // Add one — if already exists, increment quantity
        addToCart: (state, action: PayloadAction<Omit<CartItem, "quantity">>) => {
            const existing = state.items.find((i) => i.menuId === action.payload.menuId);
            if (existing) {
                existing.quantity += 1;
            } else {
                state.items.push({ ...action.payload, quantity: 1 });
            }
        },

        // Increment quantity by 1
        incrementItem: (state, action: PayloadAction<string>) => {
            const item = state.items.find((i) => i.menuId === action.payload);
            if (item) item.quantity += 1;
        },

        // Decrement by 1 — remove if reaches 0
        decrementItem: (state, action: PayloadAction<string>) => {
            const index = state.items.findIndex((i) => i.menuId === action.payload);
            if (index === -1) return;
            if (state.items[index].quantity <= 1) {
                state.items.splice(index, 1);
            } else {
                state.items[index].quantity -= 1;
            }
        },

        // Remove all of a specific menu item
        removeFromCart: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter((i) => i.menuId !== action.payload);
        },

        // Clear entire cart after checkout
        clearCart: (state) => {
            state.items = [];
        },
    },
});

export const {
    addToCart,
    incrementItem,
    decrementItem,
    removeFromCart,
    clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;