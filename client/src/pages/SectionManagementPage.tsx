// src/pages/SectionManagementPage.tsx
import { useEffect, useState } from "react";
import {
    sectionService,
    typeService,
    filterService,
    type SectionMenu,
    type Type,
    type FilterMenu,
} from "../services/categoryServices";

const SectionManagementPage = () => {
    const [sections, setSections] = useState<SectionMenu[]>([]);
    const [types, setTypes] = useState<Type[]>([]);
    const [filters, setFilters] = useState<FilterMenu[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<SectionMenu | null>(null);
    const [form, setForm] = useState({
        name: "",
        description: "",
        typeId: "",
        filterIds: [] as string[],
    });
    const [submitError, setSubmitError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const [search, setSearch] = useState("");
    const [filterByType, setFilterByType] = useState("all");

    const fetchAll = async () => {
        setLoading(true);
        setError("");
        try {
            const [sectionData, typeData, filterData] = await Promise.all([
                sectionService.getAll(),
                typeService.getAll(),
                filterService.getAll(),
            ]);
            setSections(sectionData);
            setTypes([...typeData].sort((a, b) => a.foodTypeId - b.foodTypeId));
            setFilters(filterData);
        } catch (err: any) {
            setError(err.message || "Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    const openCreate = () => {
        setEditing(null);
        setForm({
            name: "",
            description: "",
            typeId: types[0]?.id || "",
            filterIds: [],
        });
        setSubmitError("");
        setShowModal(true);
    };

    const openEdit = (s: SectionMenu) => {
        setEditing(s);
        setForm({
            name: s.name,
            description: s.description || "",
            typeId: s.typeId,
            filterIds: s.filterMenus?.map((f) => f.id) || [], // ← filterMenus (lowercase)
        });
        setSubmitError("");
        setShowModal(true);
    };

    const toggleFilter = (filterId: string) => {
        setForm((prev) => ({
            ...prev,
            filterIds: prev.filterIds.includes(filterId)
                ? prev.filterIds.filter((id) => id !== filterId)
                : [...prev.filterIds, filterId],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError("");

        if (!form.typeId) return setSubmitError("Please select a Type");

        setSubmitting(true);
        try {
            if (editing) {
                await sectionService.update(editing.id, form);
            } else {
                await sectionService.create(form);
            }
            setShowModal(false);
            await fetchAll();
        } catch (err: any) {
            setSubmitError(err.message || "Failed to save");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Delete section "${name}"?`)) return;
        try {
            await sectionService.delete(id);
            await fetchAll();
        } catch (err: any) {
            alert(err.message || "Failed to delete");
        }
    };

    const getTypeName = (typeId: string) =>
        types.find((t) => t.id === typeId)?.description || "—";

    const filtered = sections.filter((s) => {
        const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
        const matchType = filterByType === "all" || s.typeId === filterByType;
        return matchSearch && matchType;
    });

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h1 style={styles.pageTitle}>Section Management</h1>
                    <p style={styles.subtitle}>
                        {sections.length} sections · Group filters by section
                    </p>
                </div>
                <button onClick={openCreate} style={styles.primaryBtn}>
                    + Add Section
                </button>
            </div>

            <div style={styles.filterBar}>
                <input
                    type="text"
                    placeholder="Search section name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={styles.searchInput}
                />
                <select
                    value={filterByType}
                    onChange={(e) => setFilterByType(e.target.value)}
                    style={styles.select}
                >
                    <option value="all">All Types</option>
                    {types.map((t) => (
                        <option key={t.id} value={t.id}>
                            {t.description}
                        </option>
                    ))}
                </select>
                <button onClick={fetchAll} style={styles.refreshBtn}>
                    🔄 Refresh
                </button>
            </div>

            {error && <div style={styles.errorBox}>{error}</div>}

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div style={styles.grid}>
                    {filtered.map((s) => (
                        <div key={s.id} style={styles.card}>
                            <div style={styles.cardHeader}>
                                <div style={{ flex: 1 }}>
                                    <h3 style={styles.cardTitle}>{s.name}</h3>
                                    <span style={styles.typeBadge}>
                                        {s.type?.description || getTypeName(s.typeId)}
                                    </span>
                                </div>
                            </div>

                            <p style={styles.cardDesc}>
                                {s.description || <em style={{ color: "#999" }}>No description</em>}
                            </p>

                            <div style={styles.filterChips}>
                                {s.filterMenus && s.filterMenus.length > 0 ? (
                                    s.filterMenus.map((f) => (
                                        <span key={f.id} style={styles.chip}>
                                            {f.name}
                                        </span>
                                    ))
                                ) : (
                                    <em style={{ color: "#999", fontSize: 12 }}>No filters linked</em>
                                )}
                            </div>

                            <div style={styles.cardActions}>
                                <button onClick={() => openEdit(s)} style={styles.editBtn}>
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(s.id, s.name)}
                                    style={styles.deleteBtn}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                    {filtered.length === 0 && (
                        <div style={styles.empty}>
                            <p>No sections found</p>
                        </div>
                    )}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div style={styles.modal} onClick={() => setShowModal(false)}>
                    <form
                        style={styles.modalBox}
                        onClick={(e) => e.stopPropagation()}
                        onSubmit={handleSubmit}
                    >
                        <div style={styles.modalHeader}>
                            <h2 style={{ margin: 0 }}>
                                {editing ? "Edit Section" : "Add New Section"}
                            </h2>
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                style={styles.closeIcon}
                            >
                                ✕
                            </button>
                        </div>

                        <label style={styles.label}>Section Name *</label>
                        <input
                            required
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            style={styles.input}
                            placeholder="Breakfast Combo, Happy Meal, etc."
                        />

                        <label style={styles.label}>Description</label>
                        <textarea
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            style={{ ...styles.input, minHeight: 60, resize: "vertical" }}
                            placeholder="Optional..."
                        />

                        <label style={styles.label}>Type *</label>
                        <select
                            required
                            value={form.typeId}
                            onChange={(e) => setForm({ ...form, typeId: e.target.value })}
                            style={styles.input}
                        >
                            <option value="">-- Select Type --</option>
                            {types.map((t) => (
                                <option key={t.id} value={t.id}>
                                    {t.description}
                                </option>
                            ))}
                        </select>

                        <label style={styles.label}>
                            Linked Filters ({form.filterIds.length} selected)
                        </label>
                        <div style={styles.filterSelector}>
                            {filters.length === 0 ? (
                                <em style={{ color: "#999", fontSize: 13 }}>
                                    No filters available. Create filters first.
                                </em>
                            ) : (
                                filters.map((f) => (
                                    <label
                                        key={f.id}
                                        style={{
                                            ...styles.filterCheckbox,
                                            background: form.filterIds.includes(f.id) ? "#DA291C" : "#fff",
                                            color: form.filterIds.includes(f.id) ? "#fff" : "#333",
                                            borderColor: form.filterIds.includes(f.id) ? "#DA291C" : "#ddd",
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={form.filterIds.includes(f.id)}
                                            onChange={() => toggleFilter(f.id)}
                                            style={{ display: "none" }}
                                        />
                                        {f.name}
                                    </label>
                                ))
                            )}
                        </div>

                        {submitError && <div style={styles.errorBox}>{submitError}</div>}

                        <div style={styles.btnGroup}>
                            <button type="submit" disabled={submitting} style={styles.primaryBtn}>
                                {submitting ? "Saving..." : editing ? "Update" : "Create"}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                style={styles.cancelBtn}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

const styles: Record<string, React.CSSProperties> = {
    container: { padding: 24 },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 20,
    },
    pageTitle: { margin: 0, fontSize: 24 },
    subtitle: { margin: "4px 0 0", color: "#666", fontSize: 13 },
    primaryBtn: {
        padding: "10px 18px",
        background: "#DA291C",
        color: "#fff",
        border: "none",
        borderRadius: 6,
        cursor: "pointer",
        fontWeight: 600,
    },
    cancelBtn: {
        padding: "10px 18px",
        background: "#999",
        color: "#fff",
        border: "none",
        borderRadius: 6,
        cursor: "pointer",
    },
    filterBar: { display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" },
    searchInput: {
        flex: 1,
        minWidth: 200,
        padding: "10px 12px",
        border: "1px solid #ddd",
        borderRadius: 6,
        fontSize: 14,
    },
    select: {
        padding: "10px 12px",
        border: "1px solid #ddd",
        borderRadius: 6,
        fontSize: 14,
        background: "#fff",
    },
    refreshBtn: {
        padding: "10px 14px",
        background: "#fff",
        border: "1px solid #ddd",
        borderRadius: 6,
        cursor: "pointer",
        fontSize: 14,
    },
    errorBox: {
        background: "#fee",
        color: "#c33",
        padding: 12,
        borderRadius: 6,
        marginBottom: 16,
        fontSize: 14,
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: 16,
    },
    empty: { gridColumn: "1 / -1", padding: 40, textAlign: "center", color: "#999" },
    card: {
        background: "#fff",
        borderRadius: 10,
        padding: 16,
        boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
    },
    cardHeader: { marginBottom: 8 },
    cardTitle: { margin: "0 0 4px", fontSize: 17 },
    cardDesc: {
        fontSize: 13,
        color: "#666",
        margin: "0 0 12px",
        minHeight: 32,
    },
    typeBadge: {
        display: "inline-block",
        background: "#FFC72C",
        color: "#000",
        padding: "2px 8px",
        borderRadius: 10,
        fontSize: 11,
        fontWeight: 700,
        textTransform: "uppercase",
    },
    filterChips: {
        display: "flex",
        flexWrap: "wrap",
        gap: 4,
        marginBottom: 12,
        minHeight: 28,
    },
    chip: {
        background: "#f0f0f0",
        padding: "3px 10px",
        borderRadius: 12,
        fontSize: 11,
        color: "#333",
    },
    cardActions: {
        display: "flex",
        gap: 6,
        borderTop: "1px solid #eee",
        paddingTop: 10,
    },
    editBtn: {
        flex: 1,
        padding: "8px",
        background: "#3498db",
        color: "#fff",
        border: "none",
        borderRadius: 6,
        cursor: "pointer",
        fontSize: 13,
    },
    deleteBtn: {
        flex: 1,
        padding: "8px",
        background: "#e74c3c",
        color: "#fff",
        border: "none",
        borderRadius: 6,
        cursor: "pointer",
        fontSize: 13,
    },
    modal: {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: 20,
    },
    modalBox: {
        background: "#fff",
        padding: 28,
        borderRadius: 10,
        width: "100%",
        maxWidth: 540,
        maxHeight: "90vh",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
    },
    modalHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    closeIcon: {
        background: "transparent",
        border: "none",
        fontSize: 20,
        cursor: "pointer",
        color: "#666",
    },
    label: {
        fontSize: 13,
        fontWeight: 600,
        marginBottom: 6,
        marginTop: 12,
        color: "#333",
    },
    input: {
        padding: "10px 12px",
        border: "1px solid #ddd",
        borderRadius: 6,
        fontSize: 14,
        fontFamily: "inherit",
    },
    filterSelector: {
        display: "flex",
        flexWrap: "wrap",
        gap: 6,
        padding: 10,
        border: "1px solid #ddd",
        borderRadius: 6,
        background: "#fafafa",
        minHeight: 60,
    },
    filterCheckbox: {
        padding: "6px 12px",
        border: "1px solid #ddd",
        borderRadius: 16,
        cursor: "pointer",
        fontSize: 13,
        userSelect: "none",
        transition: "all 0.15s",
    },
    btnGroup: { display: "flex", gap: 8, marginTop: 20 },
};

export default SectionManagementPage;