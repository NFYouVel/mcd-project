// src/pages/FilterManagementPage.tsx
import { useEffect, useState } from "react";
import { filterService, type FilterMenu } from "../services/categoryServices";

const FilterManagementPage = () => {
    const [filters, setFilters] = useState<FilterMenu[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<FilterMenu | null>(null);
    const [form, setForm] = useState({ name: "", description: "" });
    const [submitError, setSubmitError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [search, setSearch] = useState("");

    const fetchFilters = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await filterService.getAll();
            setFilters(data);
        } catch (err: any) {
            setError(err.message || "Failed to load filters");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFilters();
    }, []);

    const openCreate = () => {
        setEditing(null);
        setForm({ name: "", description: "" });
        setSubmitError("");
        setShowModal(true);
    };

    const openEdit = (f: FilterMenu) => {
        setEditing(f);
        setForm({ name: f.name, description: f.description || "" });
        setSubmitError("");
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError("");
        setSubmitting(true);
        try {
            if (editing) {
                await filterService.update(editing.id, form);
            } else {
                await filterService.create(form);
            }
            setShowModal(false);
            await fetchFilters();
        } catch (err: any) {
            setSubmitError(err.message || "Failed to save");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Delete filter "${name}"? This may affect related menus.`)) return;
        try {
            await filterService.delete(id);
            await fetchFilters();
        } catch (err: any) {
            alert(err.message || "Failed to delete");
        }
    };

    const filtered = filters.filter((f) =>
        f.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h1 style={styles.pageTitle}>Filter Management</h1>
                    <p style={styles.subtitle}>{filters.length} filters · Used to categorize menus</p>
                </div>
                <button onClick={openCreate} style={styles.primaryBtn}>
                    + Add Filter
                </button>
            </div>

            <div style={styles.filterBar}>
                <input
                    type="text"
                    placeholder="Search filter name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={styles.searchInput}
                />
                <button onClick={fetchFilters} style={styles.refreshBtn}>
                    🔄 Refresh
                </button>
            </div>

            {error && <div style={styles.errorBox}>{error}</div>}

            {loading ? (
                <p>Loading filters...</p>
            ) : (
                <div style={styles.tableWrap}>
                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.thRow}>
                                <th style={styles.th}>Name</th>
                                <th style={styles.th}>Description</th>
                                <th style={styles.th}>Created</th>
                                <th style={styles.th}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((f) => (
                                <tr key={f.id} style={styles.tr}>
                                    <td style={styles.td}>
                                        <strong>{f.name}</strong>
                                    </td>
                                    <td style={styles.td}>
                                        {f.description || <em style={{ color: "#999" }}>—</em>}
                                    </td>
                                    <td style={styles.td}>
                                        {f.createdAt ? new Date(f.createdAt).toLocaleDateString("id-ID") : "—"}
                                    </td>
                                    <td style={styles.td}>
                                        <button onClick={() => openEdit(f)} style={styles.editBtn}>
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(f.id, f.name)}
                                            style={styles.deleteBtn}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={4} style={styles.emptyTd}>
                                        No filters found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
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
                            <h2 style={{ margin: 0 }}>{editing ? "Edit Filter" : "Add New Filter"}</h2>
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                style={styles.closeIcon}
                            >
                                ✕
                            </button>
                        </div>

                        <label style={styles.label}>Name *</label>
                        <input
                            required
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            style={styles.input}
                            placeholder="Burger, Drinks, etc."
                        />

                        <label style={styles.label}>Description</label>
                        <textarea
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            style={{ ...styles.input, minHeight: 70, resize: "vertical" }}
                            placeholder="Optional description..."
                        />

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
    filterBar: { display: "flex", gap: 8, marginBottom: 20 },
    searchInput: {
        flex: 1,
        padding: "10px 12px",
        border: "1px solid #ddd",
        borderRadius: 6,
        fontSize: 14,
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
    tableWrap: {
        background: "#fff",
        borderRadius: 8,
        overflow: "hidden",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    },
    table: { width: "100%", borderCollapse: "collapse" },
    thRow: { background: "#1a1a1a", color: "#fff" },
    th: { padding: 12, textAlign: "left", fontSize: 13 },
    tr: { borderBottom: "1px solid #eee" },
    td: { padding: 12, fontSize: 14 },
    emptyTd: { padding: 32, textAlign: "center", color: "#999" },
    editBtn: {
        padding: "6px 12px",
        background: "#3498db",
        color: "#fff",
        border: "none",
        borderRadius: 6,
        cursor: "pointer",
        marginRight: 6,
        fontSize: 13,
    },
    deleteBtn: {
        padding: "6px 12px",
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
        maxWidth: 480,
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
    btnGroup: { display: "flex", gap: 8, marginTop: 18 },
};

export default FilterManagementPage;