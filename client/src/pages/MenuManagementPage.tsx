import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import {
    setMenus, addMenu, updateMenuItem, removeMenu, setSearch, setFilterId,
} from "../store/menuSlice";
import { setFilters } from "../store/filterSlice";
import {
    getMenusRequest,
    getFiltersRequest,
    createMenuRequest,
    updateMenuRequest,
    toggleMenuRequest,
    deleteMenuRequest,
} from "../services/api";
import type { Menu } from "../types";
import Modal from "../components/Modal";
import Loading from "../components/Loading";

export default function MenuManagement() {
    const dispatch = useAppDispatch();
    const items = useAppSelector((s) => s.menus.items);
    const search = useAppSelector((s) => s.menus.search);
    const filterId = useAppSelector((s) => s.menus.filterId);
    const filters = useAppSelector((s) => s.filters.items);

    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Menu | null>(null);
    const [form, setForm] = useState({
        name: "", description: "", price: "", filterMenuId: "",
        isNew: true, isAvailable: true,
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");

    // load filters once
    useEffect(() => {
        getFiltersRequest()
            .then((d) => dispatch(setFilters(d)))
            .catch((e) => alert(e.message));
    }, [dispatch]);

    // load menus (with debounce on search/filter)
    useEffect(() => {
        setLoading(true);
        const t = setTimeout(() => {
            getMenusRequest(search, filterId)
                .then((d) => dispatch(setMenus(d)))
                .catch((e) => alert(e.message))
                .finally(() => setLoading(false));
        }, 300);
        return () => clearTimeout(t);
    }, [search, filterId, dispatch]);

    const openCreate = () => {
        setEditing(null);
        setForm({ name: "", description: "", price: "", filterMenuId: "", isNew: true, isAvailable: true });
        setImageFile(null);
        setImagePreview("");
        setOpen(true);
    };

    const openEdit = (m: Menu) => {
        setEditing(m);
        setForm({
            name: m.name,
            description: m.description || "",
            price: String(m.price),
            filterMenuId: m.filterMenuId,
            isNew: m.isNew,
            isAvailable: m.isAvailable,
        });
        setImageFile(null);
        setImagePreview(m.imageUrl || "");
        setOpen(true);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fd = new FormData();
        fd.append("name", form.name);
        fd.append("description", form.description);
        fd.append("price", form.price);
        fd.append("filterMenuId", form.filterMenuId);
        fd.append("isNew", String(form.isNew));
        fd.append("isAvailable", String(form.isAvailable));
        if (imageFile) fd.append("image", imageFile);

        try {
            if (editing) {
                const updated = await updateMenuRequest(editing.id, fd);
                dispatch(updateMenuItem(updated));
            } else {
                const created = await createMenuRequest(fd);
                dispatch(addMenu(created));
            }
            setOpen(false);
        } catch (err: any) {
            alert(err.message);
        }
    };

    const toggle = async (id: string) => {
        try {
            const updated = await toggleMenuRequest(id);
            dispatch(updateMenuItem(updated));
        } catch (err: any) {
            alert(err.message);
        }
    };

    const remove = async (id: string) => {
        if (!confirm("Yakin hapus menu ini?")) return;
        try {
            await deleteMenuRequest(id);
            dispatch(removeMenu(id));
        } catch (err: any) {
            alert(err.message);
        }
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">🍔 Menu Management</h1>
                    <p className="page-subtitle">Kelola semua menu McDonald's lo disini</p>
                </div>
                <button className="btn btn-primary" onClick={openCreate}>
                    + Add Menu
                </button>
            </div>

            <div className="toolbar">
                <input
                    className="input"
                    placeholder="🔎 Search menu by name..."
                    value={search}
                    onChange={(e) => dispatch(setSearch(e.target.value))}
                />
                <select
                    className="input"
                    style={{ maxWidth: 220 }}
                    value={filterId}
                    onChange={(e) => dispatch(setFilterId(e.target.value))}
                >
                    <option value="">All Filters</option>
                    {filters.map((f) => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                </select>
            </div>

            {loading ? (
                <Loading />
            ) : (
                <div className="menu-grid">
                    {items.map((m) => (
                        <div key={m.id} className="menu-card">
                            <div className="menu-image-wrap">
                                {m.imageUrl ? (
                                    <img src={m.imageUrl} alt={m.name} className="menu-image" />
                                ) : (
                                    <div className="menu-image-placeholder">🍔</div>
                                )}
                                <div className="menu-badges">
                                    {m.isNew && <span className="badge badge-yellow">NEW</span>}
                                    <span className={"badge " + (m.isAvailable ? "badge-green" : "badge-gray")}>
                                        {m.isAvailable ? "AVAILABLE" : "SOLD OUT"}
                                    </span>
                                </div>
                            </div>
                            <div className="menu-info">
                                <div className="menu-name">{m.name}</div>
                                <div className="menu-desc">{m.description || "No description"}</div>
                                <div className="menu-price">Rp {m.price.toLocaleString("id-ID")}</div>
                                <div className="menu-actions">
                                    <button className="btn btn-blue btn-sm" onClick={() => openEdit(m)}>Edit</button>
                                    <button className="btn btn-yellow btn-sm" onClick={() => toggle(m.id)}>Toggle</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => remove(m.id)}>Del</button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {items.length === 0 && (
                        <div className="empty" style={{ gridColumn: "1 / -1" }}>
                            <div style={{ fontSize: "3rem", marginBottom: 8 }}>🍟</div>
                            <div>No menus found. Add one to get started!</div>
                        </div>
                    )}
                </div>
            )}

            <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit Menu" : "New Menu"}>
                <form className="form" onSubmit={submit}>
                    {imagePreview && (
                        <img src={imagePreview} alt="preview" className="image-preview" />
                    )}
                    <div>
                        <label className="label">Image</label>
                        <input type="file" accept="image/*" onChange={handleImageChange} />
                    </div>
                    <div>
                        <label className="label">Name *</label>
                        <input
                            className="input"
                            required
                            placeholder="Big Mac"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="label">Description</label>
                        <textarea
                            className="input"
                            rows={3}
                            placeholder="Two beef patties, special sauce..."
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                        />
                    </div>
                    <div className="form-row">
                        <div>
                            <label className="label">Price (Rp) *</label>
                            <input
                                className="input"
                                required
                                type="number"
                                placeholder="45000"
                                value={form.price}
                                onChange={(e) => setForm({ ...form, price: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="label">Filter *</label>
                            <select
                                className="input"
                                required
                                value={form.filterMenuId}
                                onChange={(e) => setForm({ ...form, filterMenuId: e.target.value })}
                            >
                                <option value="">-- Pilih --</option>
                                {filters.map((f) => (
                                    <option key={f.id} value={f.id}>{f.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="checkbox-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={form.isNew}
                                onChange={(e) => setForm({ ...form, isNew: e.target.checked })}
                            />
                            <span>Mark as NEW</span>
                        </label>
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={form.isAvailable}
                                onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
                            />
                            <span>Available</span>
                        </label>
                    </div>
                    <button className="btn btn-primary" style={{ padding: "12px", fontSize: "1rem" }}>
                        {editing ? "💾 Update Menu" : "✨ Create Menu"}
                    </button>
                </form>
            </Modal>
        </div>
    );
}