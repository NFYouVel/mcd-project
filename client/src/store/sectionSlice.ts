import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { MenuSection } from "../types";

interface State { items: MenuSection[]; loading: boolean; }
const initialState: State = { items: [], loading: false };

const slice = createSlice({
    name: "sections",
    initialState,
    reducers: {
        setLoading: (s, a: PayloadAction<boolean>) => { s.loading = a.payload; },
        setSections: (s, a: PayloadAction<MenuSection[]>) => { s.items = a.payload; },
        addSection: (s, a: PayloadAction<MenuSection>) => { s.items.push(a.payload); },
        updateSectionItem: (s, a: PayloadAction<MenuSection>) => {
            const i = s.items.findIndex((x) => x.id === a.payload.id);
            if (i !== -1) s.items[i] = a.payload;
        },
        removeSection: (s, a: PayloadAction<string>) => {
            s.items = s.items.filter((x) => x.id !== a.payload);
        },
    },
});

export const { setLoading, setSections, addSection, updateSectionItem, removeSection } = slice.actions;
export default slice.reducer;