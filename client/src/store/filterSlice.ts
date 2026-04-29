import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FilterMenu } from "../types";

interface State { items: FilterMenu[]; loading: boolean; }
const initialState: State = { items: [], loading: false };

const slice = createSlice({
    name: "filters",
    initialState,
    reducers: {
        setLoading: (s, a: PayloadAction<boolean>) => { s.loading = a.payload; },
        setFilters: (s, a: PayloadAction<FilterMenu[]>) => { s.items = a.payload; },
        addFilter: (s, a: PayloadAction<FilterMenu>) => { s.items.push(a.payload); },
        updateFilterItem: (s, a: PayloadAction<FilterMenu>) => {
            const i = s.items.findIndex((x) => x.id === a.payload.id);
            if (i !== -1) s.items[i] = a.payload;
        },
        removeFilter: (s, a: PayloadAction<string>) => {
            s.items = s.items.filter((x) => x.id !== a.payload);
        },
    },
});

export const { setLoading, setFilters, addFilter, updateFilterItem, removeFilter } = slice.actions;
export default slice.reducer;