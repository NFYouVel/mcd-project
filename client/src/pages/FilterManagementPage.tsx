import { useEffect, useState, FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { setFilters, addFilter, updateFilterItem, removeFilter } from "../store/filterSlice";
import { setSections } from "../store/sectionSlice";
import { api } from "../api/client";
import { FilterMenu, MenuSection } from "../types";
import Modal from "../components/Modal";
import Loading from "../components/Loading";

export default function FilterManagement() {
    const dispatch = useAppDispatch();
    const items = useAppSelector((s) => s.filters.items);
    const sections = useAppSelector((s) => s.sections.items);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<FilterMenu | null>(null);
    const [form, setForm] = useState({ name: "", description: "", sectionMenuId: "" });

    useEffect(() => {
        Promise.all([
            api.get<FilterMenu[]>("/filters"),
            api.get<MenuSection[]>("/sections"),
        ]).then(([f, s]) => {
            dispatch(setFilters(f));
            dispatch(setSections(s));
        }).catch((e) => alert(e.message))
            .finally(() => setLoading(false));
    }, [dispatch]);

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            if (editing) {
                const updated = await api.put<FilterMenu>(`/filters/${editing.id}`, form);
                dispatch(updateFilterItem(updated));
            } else {
                const created = await api.post<FilterMenu>("/filters", form);
                dispatch(addFilter(created));
            }
            setOpen(false);
        } catch (err) { alert(err.message); }
    };

    const remove = async (id: string) => {
        if (!confirm("Yakin hapus?")) return;
        await api.delete(`/filters/${id}`);
        dispatch(removeFilter(id));
    };

    if (loading) return <Loading />;

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">🔍 Filter Management</h1>
                    <p className="page-subtitle">Sub-kategori dari Section</p>
                </div>
                <button className="btn btn-primary" onClick={() => {
                    setEditing(null); setForm({ name: "", description: "", sectionMenuId: "" }); setOpen(true);
                }}>+ Add Filter</button>
            </div>

            <div className="table-wrap">
                <table className="table">
                    <thead>
                        <tr><th>Name</th><th>Description</th><th>Section</th><th>Menus</th><th style={{ textAlign: "center" }}>Action</th></tr>
                    </thead>
                    <tbody>
                        {items.map((it) => (
                            <tr key={it.id}>
                                <td><strong>{it.name}</strong></td>
                                <td>{it.description}</td>
                                <td>{it.menuSection?.name || "—"}</td>
                                <td>{it.menus?.length || 0} items</td>
                                <td className="table-actions">
                                    <button className="btn btn-blue btn-sm" onClick={() => {
                                        setEditing(it);
                                        setForm({ name: it.name, description: it.description || "", sectionMenuId: it.sectionMenuId });
                                        setOpen(true);
                                    }}>Edit</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => remove(it.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                        {items.length === 0 && <tr><td colSpan={5} className="empty">No filters yet.</td></tr>}
                    </tbody>
                </table>
            </div>

            <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit Filter" : "New Filter"}>
                <form className="form" onSubmit={submit}>
                    <div>
                        <label className="label">Name</label>
                        <input className="input" required value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div>
                        <label className="label">Description</label>
                        <textarea className="input" rows={3} value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })} />
                    </div>
                    <div>
                        <label className="label">Section</label>
                        <select className="input" required value={form.sectionMenuId}
                            onChange={(e) => setForm({ ...form, sectionMenuId: e.target.value })}>
                            <option value="">-- Pilih Section --</option>
                            {sections.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                    <button className="btn btn-primary" style={{ padding: "12px" }}>
                        {editing ? "Update" : "Create"}
                    </button>
                </form>
            </Modal>
        </div>
    );
}