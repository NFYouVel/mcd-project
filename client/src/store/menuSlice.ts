import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Menu } from "../types";

interface State { items: Menu[]; loading: boolean; search: string; filterId: string; }
const initialState: State = { items: [], loading: false, search: "", filterId: "" };

const slice = createSlice({
    name: "menus",
    initialState,
    reducers: {
        setLoading: (s, a: PayloadAction<boolean>) => { s.loading = a.payload; },
        setMenus: (s, a: PayloadAction<Menu[]>) => { s.items = a.payload; },
        addMenu: (s, a: PayloadAction<Menu>) => { s.items.unshift(a.payload); },
        updateMenuItem: (s, a: PayloadAction<Menu>) => {
            const i = s.items.findIndex((x) => x.id === a.payload.id);
            if (i !== -1) s.items[i] = a.payload;
        },
        removeMenu: (s, a: PayloadAction<string>) => {
            s.items = s.items.filter((x) => x.id !== a.payload);
        },
        setSearch: (s, a: PayloadAction<string>) => { s.search = a.payload; },
        setFilterId: (s, a: PayloadAction<string>) => { s.filterId = a.payload; },
    },
});

export const {
    setLoading, setMenus, addMenu, updateMenuItem, removeMenu, setSearch, setFilterId,
} = slice.actions;
export default slice.reducer;