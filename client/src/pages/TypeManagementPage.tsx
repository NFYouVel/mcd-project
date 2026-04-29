import { useEffect, useState, FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { setTypes, addType, updateTypeItem, removeType } from "../store/typeSlice";
import { api } from "../api/client";
import { Type } from "../types";
import Modal from "../components/Modal";
import Loading from "../components/Loading";

export default function TypeManagement() {
    const dispatch = useAppDispatch();
    const items = useAppSelector((s) => s.types.items);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Type | null>(null);
    const [form, setForm] = useState({ foodTypeId: "", description: "Heavy" as Type["description"] });

    useEffect(() => {
        api.get<Type[]>("/types")
            .then((d) => dispatch(setTypes(d)))
            .catch((e) => alert(e.message))
            .finally(() => setLoading(false));
    }, [dispatch]);

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        const payload = { foodTypeId: Number(form.foodTypeId), description: form.description };
        try {
            if (editing) {
                const updated = await api.put<Type>(`/types/${editing.id}`, payload);
                dispatch(updateTypeItem(updated));
            } else {
                const created = await api.post<Type>("/types", payload);
                dispatch(addType(created));
            }
            setOpen(false);
        } catch (error) { 
            alert(error); 
        }
    };

    const remove = async (id: string) => {
        if (!confirm("Yakin hapus?")) return;
        await api.delete(`/types/${id}`);
        dispatch(removeType(id));
    };

    if (loading) return <Loading />;

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">🏷️ Type Management</h1>
                    <p className="page-subtitle">Promotion / Heavy / Light</p>
                </div>
                <button className="btn btn-primary" onClick={() => {
                    setEditing(null); setForm({ foodTypeId: "", description: "Heavy" }); setOpen(true);
                }}>+ Add Type</button>
            </div>

            <div className="table-wrap">
                <table className="table">
                    <thead>
                        <tr><th>Food Type ID</th><th>Description</th><th>Sections</th><th style={{ textAlign: "center" }}>Action</th></tr>
                    </thead>
                    <tbody>
                        {items.map((it) => (
                            <tr key={it.id}>
                                <td>{it.foodTypeId}</td>
                                <td><span className="badge badge-yellow">{it.description}</span></td>
                                <td>{it.menuSections?.length || 0} sections</td>
                                <td className="table-actions">
                                    <button className="btn btn-blue btn-sm" onClick={() => {
                                        setEditing(it);
                                        setForm({ foodTypeId: String(it.foodTypeId), description: it.description });
                                        setOpen(true);
                                    }}>Edit</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => remove(it.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                        {items.length === 0 && <tr><td colSpan={4} className="empty">No types yet.</td></tr>}
                    </tbody>
                </table>
            </div>

            <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit Type" : "New Type"}>
                <form className="form" onSubmit={submit}>
                    <div>
                        <label className="label">Food Type ID</label>
                        <input className="input" required type="number" value={form.foodTypeId}
                            onChange={(e) => setForm({ ...form, foodTypeId: e.target.value })} />
                    </div>
                    <div>
                        <label className="label">Description</label>
                        <select className="input" value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value as Type["description"] })}>
                            <option value="Promotion">Promotion</option>
                            <option value="Heavy">Heavy</option>
                            <option value="Light">Light</option>
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