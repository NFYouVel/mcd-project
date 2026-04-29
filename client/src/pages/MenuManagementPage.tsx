import { useEffect, useState, FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import {
    setMenus, addMenu, updateMenuItem, removeMenu, setSearch, setFilterId,
} from "../store/menuSlice";
import { setFilters } from "../store/filterSlice";
import { api } from "../api/client";
import { Menu, FilterMenu } from "../types";
import Modal from "../components/Modal";
import Loading from "../components/Loading";

export default function MenuManagement() {
    const dispatch = useAppDispatch();
    const items = useA