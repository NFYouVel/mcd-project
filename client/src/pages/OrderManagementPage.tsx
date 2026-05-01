// src/pages/OrderManagementPage.tsx
import { useEffect, useState } from "react";
import { orderService, type Order, calculateOrderTotal } from "../services/orderServices";

const STATUS_OPTIONS = ["pending", "checkedout", "served", "cancelled"];

const statusColor = (s: string): string => {
    const colors: Record<string, string> = {
        pending: "#f39c12",
        checkedout: "#3498db",
        served: "#2ecc71",
        cancelled: "#e74c3c",
    };
    return colors[s] || "#999";
};

const formatRupiah = (n: number) => `Rp ${Number(n).toLocaleString("id-ID")}`;

const shortId = (id: string) => id.slice(0, 8);


const OrderManagementPage = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<Order | null>(null);
    const [filter, setFilter] = useState<string>("all");
    const [error, setError] = useState("");
    const [role, setRole] = useState<string | null>(null);


    const fetchOrders = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await orderService.getAll();
            setOrders(data);
        } catch (err: any) {
            setError(err.message || "Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
        setRole(getUserRole());
    }, []);


    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login"; // redirect ke login page
    };

    const getUserRole = (): string | null => {
        const token = localStorage.getItem("token");
        if (!token) return null;

        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            return payload.role;
        } catch {
            return null;
        }
    };


    const handleViewDetail = async (id: string) => {
        try {
            const order = await orderService.getById(id);
            setSelected(order);
        } catch (err: any) {
            // Fallback: cari dari list yang udah di-fetch
            const found = orders.find((o) => o.id === id);
            if (found) {
                setSelected(found);
            } else {
                alert(err.message || "Failed to load order detail");
            }
        }
    };

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            await orderService.updateStatus(id, status);
            await fetchOrders();
            // Update selected dengan data terbaru
            const updated = await orderService.getById(id).catch(() => null);
            if (updated) setSelected(updated);
        } catch (err: any) {
            alert(err.message || "Failed to update status");
        }
    };

    const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.pageTitle}>Order Management</h1>
                <div style={styles.headerRight}>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        style={styles.select}
                    >
                        <option value="all">All Status</option>
                        {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>
                    <button onClick={fetchOrders} style={styles.refreshBtn}>
                        🔄 Refresh
                    </button>
                    {role === "cashier" && (
                        <button onClick={handleLogout} style={styles.logoutBtn}>
                            🚪 Logout
                        </button>
                    )}
                </div>
            </div>

            {error && <div style={styles.errorBox}>{error}</div>}

            {loading ? (
                <p>Loading orders...</p>
            ) : (
                <div style={styles.tableWrap}>
                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.thRow}>
                                <th style={styles.th}>Order ID</th>
                                <th style={styles.th}>Items</th>
                                <th style={styles.th}>Total</th>
                                <th style={styles.th}>Status</th>
                                <th style={styles.th}>Created At</th>
                                <th style={styles.th}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((o) => (
                                <tr key={o.id} style={styles.tr}>
                                    <td style={styles.td}>
                                        <code style={styles.idCode}>{shortId(o.id)}</code>
                                    </td>
                                    <td style={styles.td}>{o.orderItems?.length || 0} items</td>
                                    <td style={styles.td}>
                                        <strong>{formatRupiah(calculateOrderTotal(o))}</strong>
                                    </td>
                                    <td style={styles.td}>
                                        <span
                                            style={{
                                                ...styles.badge,
                                                background: statusColor(o.status),
                                            }}
                                        >
                                            {o.status}
                                        </span>
                                    </td>
                                    <td style={styles.td}>
                                        {new Date(o.createdAt).toLocaleString("id-ID")}
                                    </td>
                                    <td style={styles.td}>
                                        <button
                                            onClick={() => handleViewDetail(o.id)}
                                            style={styles.viewBtn}
                                        >
                                            View / Update
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={6} style={styles.emptyTd}>
                                        No orders found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal Detail */}
            {selected && (
                <div style={styles.modal} onClick={() => setSelected(null)}>
                    <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h2 style={{ margin: 0 }}>Order Detail</h2>
                            <button
                                onClick={() => setSelected(null)}
                                style={styles.closeIcon}
                            >
                                ✕
                            </button>
                        </div>

                        <div style={styles.detailSection}>
                            <div style={styles.detailRow}>
                                <span style={styles.detailLabel}>Order ID:</span>
                                <code style={styles.idCode}>{selected.id}</code>
                            </div>
                            <div style={styles.detailRow}>
                                <span style={styles.detailLabel}>Status:</span>
                                <span
                                    style={{
                                        ...styles.badge,
                                        background: statusColor(selected.status),
                                    }}
                                >
                                    {selected.status}
                                </span>
                            </div>
                            <div style={styles.detailRow}>
                                <span style={styles.detailLabel}>Created:</span>
                                <span>{new Date(selected.createdAt).toLocaleString("id-ID")}</span>
                            </div>
                            <div style={styles.detailRow}>
                                <span style={styles.detailLabel}>Total:</span>
                                <strong style={{ color: "#DA291C" }}>
                                    {formatRupiah(calculateOrderTotal(selected))}
                                </strong>
                            </div>
                        </div>

                        <h3 style={styles.sectionTitle}>Items ({selected.orderItems?.length || 0})</h3>
                        <div style={styles.itemList}>
                            {selected.orderItems?.map((item) => (
                                <div key={item.id} style={styles.itemCard}>
                                    <div style={styles.itemHeader}>
                                        <strong>{item.menu?.name || "Unknown Menu"}</strong>
                                        <span
                                            style={{
                                                ...styles.badgeSmall,
                                                background: statusColor(item.status),
                                            }}
                                        >
                                            {item.status}
                                        </span>
                                    </div>
                                    <div style={styles.itemMeta}>
                                        <span>{formatRupiah(item.menu?.price || 0)}</span>
                                        {item.ingredientItems && item.ingredientItems.length > 0 && (
                                            <span style={styles.itemExtras}>
                                                +{item.ingredientItems.length} extras
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {(!selected.orderItems || selected.orderItems.length === 0) && (
                                <p style={{ color: "#999", textAlign: "center" }}>No items</p>
                            )}
                        </div>

                        <h3 style={styles.sectionTitle}>Update Order Status</h3>
                        <div style={styles.statusGroup}>
                            {STATUS_OPTIONS.map((s) => (
                                <button
                                    key={s}
                                    onClick={() => handleUpdateStatus(selected.id, s)}
                                    disabled={s === selected.status}
                                    style={{
                                        ...styles.statusBtn,
                                        background: statusColor(s),
                                        opacity: s === selected.status ? 0.4 : 1,
                                        cursor: s === selected.status ? "not-allowed" : "pointer",
                                    }}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>

                        <button onClick={() => setSelected(null)} style={styles.closeBtn}>
                            Close
                        </button>
                    </div>
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
        alignItems: "center",
        marginBottom: 20,
    },
    pageTitle: { margin: 0, fontSize: 24 },
    headerRight: { display: "flex", gap: 8 },
    select: {
        padding: "8px 12px",
        borderRadius: 6,
        border: "1px solid #ddd",
        fontSize: 14,
    },
    refreshBtn: {
        padding: "8px 14px",
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
    idCode: {
        background: "#f0f0f0",
        padding: "2px 6px",
        borderRadius: 4,
        fontSize: 12,
        fontFamily: "monospace",
    },
    emptyTd: { padding: 32, textAlign: "center", color: "#999" },
    badge: {
        padding: "4px 10px",
        borderRadius: 12,
        color: "#fff",
        fontSize: 12,
        textTransform: "capitalize",
        display: "inline-block",
    },
    badgeSmall: {
        padding: "2px 8px",
        borderRadius: 10,
        color: "#fff",
        fontSize: 11,
        textTransform: "capitalize",
    },
    viewBtn: {
        padding: "6px 12px",
        background: "#DA291C",
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
        maxWidth: 560,
        maxHeight: "90vh",
        overflowY: "auto",
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
    detailSection: {
        background: "#f8f8f8",
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    detailRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
        fontSize: 14,
    },
    detailLabel: { color: "#666", fontWeight: 500 },
    sectionTitle: { fontSize: 16, marginTop: 16, marginBottom: 10 },
    itemList: { marginBottom: 16 },
    itemCard: {
        background: "#fff",
        border: "1px solid #eee",
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
    },
    itemHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4,
    },
    itemMeta: {
        display: "flex",
        justifyContent: "space-between",
        fontSize: 13,
        color: "#666",
    },
    itemExtras: { color: "#FFC72C", fontWeight: 600 },
    statusGroup: {
        display: "flex",
        gap: 8,
        flexWrap: "wrap",
        marginBottom: 16,
    },
    statusBtn: {
        padding: "8px 14px",
        color: "#fff",
        border: "none",
        borderRadius: 6,
        fontSize: 13,
        textTransform: "capitalize",
    },
    closeBtn: {
        padding: "10px 16px",
        background: "#666",
        color: "#fff",
        border: "none",
        borderRadius: 6,
        cursor: "pointer",
        width: "100%",
    },
    logoutBtn: {
        padding: "8px 14px",
        background: "#e74c3c",
        color: "#fff",
        border: "none",
        borderRadius: 6,
        cursor: "pointer",
        fontSize: 14,
    },
};

export default OrderManagementPage;