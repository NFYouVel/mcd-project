import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Type } from "../types";

interface State {
    items: Type[];
    loading: boolean;
}

const initialState: State = { items: [], loading: false };

const typeSlice = createSlice({
    name: "types",
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setTypes: (state, action: PayloadAction<Type[]>) => {
            state.items = action.payload;
        },
        addType: (state, action: PayloadAction<Type>) => {
            state.items.push(action.payload);
        },
        updateTypeItem: (state, action: PayloadAction<Type>) => {
            const idx = state.items.findIndex((i) => i.id === action.payload.id);
            if (idx !== -1) state.items[idx] = action.payload;
        },
        removeType: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter((i) => i.id !== action.payload);
        },
    },
});

export const { setLoading, setTypes, addType, updateTypeItem, removeType } = typeSlice.actions;
export default typeSlice.reducer;