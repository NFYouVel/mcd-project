import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAppSelector, useAppDispatch } from "../store";
import { setTypes } from "../store/typeSlice";
import { setSections } from "../store/sectionSlice";
import { setFilters } from "../store/filterSlice";
import { setMenus } from "../store/menuSlice";
import {
    getTypesRequest,
    getSectionsRequest,
    getFiltersRequest,
    getMenusRequest,
} from "../services/api";
import Loading from "../components/Loading";

export default function Dashboard() {
    const dispatch = useAppDispatch();
    const types = useAppSelector((s) => s.types.items);
    const sections = useAppSelector((s) => s.sections.items);
    const filters = useAppSelector((s) => s.filters.items);
    const menus = useAppSelector((s) => s.menus.items);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const [t, s, f, m] = await Promise.all([
                    getTypesRequest(),
                    getSectionsRequest(),
                    getFiltersRequest(),
                    getMenusRequest(),
                ]);
                dispatch(setTypes(t));
                dispatch(setSections(s));
                dispatch(setFilters(f));
                dispatch(setMenus(m));
            } catch (err: any) {
                alert(err.message);
            } finally {
                setLoading(false);
            }
        })();
    }, [dispatch]);

    if (loading) return <Loading />;

    const cards = [
        { label: "Types", value: types.length, color: "#DA291C", to: "/menu/types", icon: "🏷️" },
        { label: "Sections", value: sections.length, color: "#FFC72C", to: "/menu/sections", icon: "📑" },
        { label: "Filters", value: filters.length, color: "#22c55e", to: "/menu/filters", icon: "🔍" },
        { label: "Menus", value: menus.length, color: "#3b82f6", to: "/menu/products", icon: "🍔" },
    ];

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Welcome, Manager 👨‍💼</h1>
                    <p className="page-subtitle">Overview of your McD store</p>
                </div>
            </div>

            <div className="stats-grid">
                {cards.map((c) => (
                    <Link key={c.label} to={c.to} className="stat-card" style={{ background: c.color }}>
                        <div className="stat-icon">{c.icon}</div>
                        <div className="stat-value">{c.value}</div>
                        <div className="stat-label">{c.label}</div>
                    </Link>
                ))}
            </div>

            <div className="card">
                <h2 style={{ marginBottom: 12 }}>🚀 Quick Actions</h2>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <Link to="/menu/products" className="btn btn-primary">+ Add New Menu</Link>
                    <Link to="/menu/sections" className="btn btn-yellow">+ Add Section</Link>
                    <Link to="/menu/filters" className="btn btn-blue">+ Add Filter</Link>
                </div>
            </div>
        </div>
    );
}