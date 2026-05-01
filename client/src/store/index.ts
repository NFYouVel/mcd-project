import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import typeReducer from "./typeSlice";
import sectionReducer from "./sectionSlice";
import filterReducer from "./filterSlice";
import menuReducer from "./menuSlice";
import cartReducer from "./cartSlice";

export const store = configureStore({
  reducer: {
    types: typeReducer,
    sections: sectionReducer,
    filters: filterReducer,
    menus: menuReducer,
    cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;