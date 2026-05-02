// src/pages/TypeManagementPage.tsx
import { useEffect, useState } from "react";
import { typeService, type Type } from "../services/categoryServices";

const TypeManagementPage = () => {
    const [types, setTypes] = useState<Type[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<number>(0);

    const fetchTypes = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await typeService.getAll();
            // Sort by foodTypeId
            data.sort((a, b) => a.foodTypeId - b.foodTypeId);
            setTypes(data);
        } catch (err: any) {
            setError(err.message || "Failed to load types");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTypes();
    }, []);

    const startEdit = (t: Type) => {
        setEditingId(t.id);
        setEditValue(t.foodTypeId);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditValue(0);
    };

    const saveEdit = async (id: string) => {
        try {
            await typeService.update(id, { foodTypeId: editValue });
            setEditingId(null);
            await fetchTypes();
        } catch (err: any) {
            alert(err.message || "Failed to update");
        }
    };

    const typeColor = (desc: string) => {
        const colors: Record<string, string> = {
            heavy: "#e74c3c",
            light: "#27ae60",
            promotion: "#FFC72C",
            drinks: "#3498db",
            dessert: "#e91e63",
            rice: "#795548",
        };
        return colors[desc] || "#999";
    };

    const typeIcon = (desc: string) => {
        const icons: Record<string, string> = {
            heavy: "🍔",
            light: "🥗",
            promotion: "🏷️",
            drinks: "🥤",
            dessert: "🍦",
            rice: "🍚",
        };
        return icons[desc] || "📦";
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h1 style={styles.pageTitle}>Type Management</h1>
                    <p style={styles.subtitle}>
                        {types.length} food types · Master data (read-only descriptions)
                    </p>
                </div>
                <button onClick={fetchTypes} style={styles.refreshBtn}>
                    🔄 Refresh
                </button>
            </div>

            {error && <div style={styles.errorBox}>{error}</div>}

            {loading ? (
                <p>Loading types...</p>
            ) : (
                <div style={styles.grid}>
                    {types.map((t) => (
                        <div
                            key={t.id}
                            style={{
                                ...styles.card,
                                borderLeft: `4px solid ${typeColor(t.description)}`,
                            }}
                        >
                            <div style={styles.cardHeader}>
                                <span style={styles.icon}>{typeIcon(t.description)}</span>
                                <div style={{ flex: 1 }}>
                                    <div style={styles.typeName}>{t.description.toUpperCase()}</div>
                                    <div style={styles.typeId}>
                                        Order:{" "}
                                        {editingId === t.id ? (
                                            <input
                                                type="number"
                                                value={editValue}
                                                onChange={(e) => setEditValue(Number(e.target.value))}
                                                style={styles.input}
                                                min={1}
                                            />
                                        ) : (
                                            <strong>#{t.foodTypeId}</strong>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div style={styles.cardActions}>
                                {editingId === t.id ? (
                                    <>
                                        <button onClick={() => saveEdit(t.id)} style={styles.saveBtn}>
                                            Save
                                        </button>
                                        <button onClick={cancelEdit} style={styles.cancelBtn}>
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <button onClick={() => startEdit(t)} style={styles.editBtn}>
                                        Edit Order
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
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
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
        gap: 14,
    },
    card: {
        background: "#fff",
        borderRadius: 8,
        padding: 16,
        boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
    },
    cardHeader: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 12,
    },
    icon: { fontSize: 32 },
    typeName: { fontWeight: 700, fontSize: 16 },
    typeId: { color: "#666", fontSize: 13, marginTop: 2 },
    cardActions: { display: "flex", gap: 6 },
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
    saveBtn: {
        flex: 1,
        padding: "8px",
        background: "#27ae60",
        color: "#fff",
        border: "none",
        borderRadius: 6,
        cursor: "pointer",
        fontSize: 13,
    },
    cancelBtn: {
        flex: 1,
        padding: "8px",
        background: "#999",
        color: "#fff",
        border: "none",
        borderRadius: 6,
        cursor: "pointer",
        fontSize: 13,
    },
    input: {
        padding: "4px 8px",
        border: "1px solid #ddd",
        borderRadius: 4,
        fontSize: 13,
        width: 60,
    },
};

export default TypeManagementPage;