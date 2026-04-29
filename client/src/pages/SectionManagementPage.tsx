import { useEffect, useState, FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { setSections, addSection, updateSectionItem, removeSection } from "../store/sectionSlice";
import { setTypes } from "../store/typeSlice";
import { api } from "../api/client";
import { MenuSection, Type } from "../types";
import Modal from "../components/Modal";
import Loading from "../components/Loading";

export default function SectionManagement() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.sections.items);
  const types = useAppSelector((s) => s.types.items);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<MenuSection | null>(null);
  const [form, setForm] = useState({ name: "", description: "", typeId: "" });

  useEffect(() => {
    Promise.all([
      api.get<MenuSection[]>("/sections"),
      api.get<Type[]>("/types"),
    ]).then(([s, t]) => {
      dispatch(setSections(s));
      dispatch(setTypes(t));
    }).catch((e) => alert(e.message))
      .finally(() => setLoading(false));
  }, [dispatch]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        const updated = await api.put<MenuSection>(`/sections/${editing.id}`, form);
        dispatch(updateSectionItem(updated));
      } else {
        const created = await api.post<MenuSection>("/sections", form);
        dispatch(addSection(created));
      }
      setOpen(false);
    } catch (err) { 
        alert(err.message); 
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Yakin hapus?")) return;
    await api.delete(`/sections/${id}`);
    dispatch(removeSection(id));
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">📑 Section Management</h1>
          <p className="page-subtitle">Burger, Chicken, Drinks, dll</p>
        </div>
        <button className="btn btn-primary" onClick={() => {
          setEditing(null); setForm({ name: "", description: "", typeId: "" }); setOpen(true);
        }}>+ Add Section</button>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr><th>Name</th><th>Description</th><th>Type</th><th style={{textAlign:"center"}}>Action</th></tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id}>
                <td><strong>{it.name}</strong></td>
                <td>{it.description}</td>
                <td><span className="badge badge-yellow">{it.type?.description || "—"}</span></td>
                <td className="table-actions">
                  <button className="btn btn-blue btn-sm" onClick={() => {
                    setEditing(it);
                    setForm({ name: it.name, description: it.description || "", typeId: it.typeId });
                    setOpen(true);
                  }}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => remove(it.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={4} className="empty">No sections yet.</td></tr>}
          </tbody>
        </table>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit Section" : "New Section"}>
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
            <label className="label">Type</label>
            <select className="input" required value={form.typeId}
              onChange={(e) => setForm({ ...form, typeId: e.target.value })}>
              <option value="">-- Pilih Type --</option>
              {types.map((t) => <option key={t.id} value={t.id}>{t.description} (ID: {t.foodTypeId})</option>)}
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