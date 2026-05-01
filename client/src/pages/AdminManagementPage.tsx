// src/pages/AdminManagementPage.tsx
import { useEffect, useState } from "react";
import { userService, type AdminUser } from "../services/userServices";

const AdminManagementPage = () => {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<AdminUser | null>(null);
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "cashier" as "manager" | "cashier",
    });
    const [submitError, setSubmitError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await userService.getAll();
            // Filter hanya manager & cashier (exclude customer)
            const admins = data.filter((u) => u.role === "manager" || u.role === "cashier");
            setUsers(admins);
        } catch (err: any) {
            setError(err.message || "Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const openCreate = () => {
        setEditing(null);
        setForm({ name: "", email: "", password: "", role: "cashier" });
        setSubmitError("");
        setShowModal(true);
    };

    const openEdit = (u: AdminUser) => {
        setEditing(u);
        setForm({
            name: u.name,
            email: u.email,
            password: "",
            role: u.role as "manager" | "cashier",
        });
        setSubmitError("");
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError("");
        setSubmitting(true);

        try {
            if (editing) {
                const payload: any = {
                    name: form.name,
                    email: form.email,
                    role: form.role,
                };
                if (form.password) payload.password = form.password;
                await userService.update(editing.id, payload);
            } else {
                await userService.create(form);
            }
            setShowModal(false);
            await fetchUsers();
        } catch (err: any) {
            setSubmitError(err.message || "Failed to save user");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this user?")) return;
        try {
            await userService.delete(id);
            await fetchUsers();
        } catch (err: any) {
            alert(err.message || "Failed to delete user");
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.pageTitle}>Admin Users</h1>
                <button onClick={openCreate} style={styles.primaryBtn}>
                    + Add User
                </button>
            </div>

            {error && <div style={styles.errorBox}>{error}</div>}

            {loading ? (
                <p>Loading users...</p>
            ) : (
                <div style={styles.tableWrap}>
                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.thRow}>
                                <th style={styles.th}>ID</th>
                                <th style={styles.th}>Name</th>
                                <th style={styles.th}>Email</th>
                                <th style={styles.th}>Role</th>
                                <th style={styles.th}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.id} style={styles.tr}>
                                    <td style={styles.td}>#{u.id}</td>
                                    <td style={styles.td}>{u.name}</td>
                                    <td style={styles.td}>{u.email}</td>
                                    <td style={styles.td}>
                                        <span
                                            style={{
                                                ...styles.badge,
                                                background: u.role === "manager" ? "#DA291C" : "#FFC72C",
                                                color: u.role === "manager" ? "#fff" : "#000",
                                            }}
                                        >
                                            {u.role}
                                        </span>
                                    </td>
                                    <td style={styles.td}>
                                        <button onClick={() => openEdit(u)} style={styles.editBtn}>
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(u.id)} style={styles.deleteBtn}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={5} style={styles.emptyTd}>
                                        No users found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal Form */}
            {showModal && (
                <div style={styles.modal} onClick={() => setShowModal(false)}>
                    <form
                        style={styles.modalBox}
                        onClick={(e) => e.stopPropagation()}
                        onSubmit={handleSubmit}
                    >
                        <h2 style={{ marginTop: 0 }}>{editing ? "Edit User" : "Add New User"}</h2>

                        <label style={styles.label}>Name</label>
                        <input
                            required
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            style={styles.input}
                        />

                        <label style={styles.label}>Email</label>
                        <input
                            type="email"
                            required
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            style={styles.input}
                        />

                        <label style={styles.label}>
                            Password {editing && "(leave empty to keep current)"}
                        </label>
                        <input
                            type="password"
                            required={!editing}
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            style={styles.input}
                        />

                        <label style={styles.label}>Role</label>
                        <select
                            value={form.role}
                            onChange={(e) =>
                                setForm({ ...form, role: e.target.value as "manager" | "cashier" })
                            }
                            style={styles.input}
                        >
                            <option value="cashier">Cashier</option>
                            <option value="manager">Manager</option>
                        </select>

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
        alignItems: "center",
        marginBottom: 20,
    },
    pageTitle: { margin: 0, fontSize: 24 },
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
    errorBox: {
        background: "#fee",
        color: "#c33",
        padding: 10,
        borderRadius: 6,
        fontSize: 13,
        marginBottom: 12,
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
    badge: {
        padding: "4px 10px",
        borderRadius: 12,
        fontSize: 12,
        textTransform: "uppercase",
        fontWeight: 600,
    },
    modal: {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
    },
    modalBox: {
        background: "#fff",
        padding: 28,
        borderRadius: 10,
        width: "100%",
        maxWidth: 460,
        display: "flex",
        flexDirection: "column",
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
    },
    btnGroup: { display: "flex", gap: 8, marginTop: 18 },
};

export default AdminManagementPage;