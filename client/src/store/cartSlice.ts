import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// ====================== TYPES ======================
export interface IngredientDetail {
    id: string;
    name: string;
    quantity: number;
}

export interface VariantDetail {
    id: string;
    name: string;
    groupName: string;
}

export interface CartItem {
    cartItemId: string;           // unique per-entry (menuId + timestamp)
    menuId: string;
    name: string;
    price: number;
    imageUrl: string | null;
    quantity: number;
    // modification details
    ingredients: IngredientDetail[];   // burger: ingredient quantities (only non-zero)
    variants: VariantDetail[];         // chicken: selected variant items
    specialRequests: string[];
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
        // Add one — always creates a new line item (different mods = different entry)
        addToCart: (
            state,
            action: PayloadAction<Omit<CartItem, "quantity" | "cartItemId">>
        ) => {
            const cartItemId = `${action.payload.menuId}_${Date.now()}`;
            state.items.push({ ...action.payload, quantity: 1, cartItemId });
        },

        // Increment quantity by 1
        incrementItem: (state, action: PayloadAction<string>) => {
            const item = state.items.find((i) => i.cartItemId === action.payload);
            if (item) item.quantity += 1;
        },

        // Decrement by 1 — remove if reaches 0
        decrementItem: (state, action: PayloadAction<string>) => {
            const index = state.items.findIndex((i) => i.cartItemId === action.payload);
            if (index === -1) return;
            if (state.items[index].quantity <= 1) {
                state.items.splice(index, 1);
            } else {
                state.items[index].quantity -= 1;
            }
        },

        updateCartItem: (state, action: PayloadAction<{
            cartItemId: string;
            price: number;
            ingredients: IngredientDetail[];
            variants: VariantDetail[];
            specialRequests: string[];
        }>) => {
            const item = state.items.find(i => i.cartItemId === action.payload.cartItemId);
            if (item) {
                item.price = action.payload.price;
                item.ingredients = action.payload.ingredients;
                item.variants = action.payload.variants;
                item.specialRequests = action.payload.specialRequests;
            }
        },

        // Remove all of a specific cart line
        removeFromCart: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter((i) => i.cartItemId !== action.payload);
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
    updateCartItem,
    removeFromCart,
    clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;