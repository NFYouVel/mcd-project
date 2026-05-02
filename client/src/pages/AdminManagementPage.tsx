// src/pages/AdminManagementPage.tsx
import { useEffect, useState } from "react";
import { userService, type AdminUser, type UserRole } from "../services/userServices";

const formatRupiah = (n: number | null | undefined) =>
    n != null ? `Rp ${Number(n).toLocaleString("id-ID")}` : "-";

const formatDate = (d?: string | null) =>
    d ? new Date(d).toLocaleDateString("id-ID", {
        year: "numeric", month: "short", day: "numeric"
    }) : "-";

// Convert ISO date to YYYY-MM-DD untuk input[type=date]
const toDateInput = (d?: string | null) => {
    if (!d) return "";
    const date = new Date(d);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split("T")[0];
};

interface FormState {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    address: string;
    birth_of_date: string;  // YYYY-MM-DD
    salary: string;          // string biar bisa kosong, di-convert pas submit
}

const initialForm: FormState = {
    name: "",
    email: "",
    password: "",
    role: "cashier",
    address: "",
    birth_of_date: "",
    salary: "",
};

const AdminManagementPage = () => {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<AdminUser | null>(null);
    const [form, setForm] = useState<FormState>(initialForm);
    const [submitError, setSubmitError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState<"all" | "manager" | "cashier">("all");

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
        setForm(initialForm);
        setSubmitError("");
        setShowModal(true);
    };

    const openEdit = (u: AdminUser) => {
        setEditing(u);
        setForm({
            name: u.name,
            email: u.email,
            password: "",
            role: u.role as UserRole,
            address: u.address || "",
            birth_of_date: toDateInput(u.birth_of_date),
            salary: u.salary != null ? String(u.salary) : "",
        });
        setSubmitError("");
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError("");

        // Validation
        if (form.salary && isNaN(Number(form.salary))) {
            return setSubmitError("Salary must be a valid number");
        }
        if (form.salary && Number(form.salary) < 0) {
            return setSubmitError("Salary must be non-negative");
        }

        setSubmitting(true);

        try {
            // Build payload
            const basePayload = {
                name: form.name,
                email: form.email,
                role: form.role,
                address: form.address || null,
                birth_of_date: form.birth_of_date || null,
                salary: form.salary ? Number(form.salary) : null,
            };

            if (editing) {
                const payload: any = { ...basePayload };
                if (form.password) payload.password = form.password;
                await userService.update(editing.id, payload);
            } else {
                if (!form.password) {
                    setSubmitting(false);
                    return setSubmitError("Password is required");
                }
                await userService.create({
                    ...basePayload,
                    password: form.password,
                });
            }
            setShowModal(false);
            await fetchUsers();
        } catch (err: any) {
            setSubmitError(err.message || "Failed to save user");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Delete user "${name}"?`)) return;
        try {
            await userService.delete(id);
            await fetchUsers();
        } catch (err: any) {
            alert(err.message || "Failed to delete user");
        }
    };

    const filtered = users.filter((u) => {
        const matchSearch =
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase());
        const matchRole = roleFilter === "all" || u.role === roleFilter;
        return matchSearch && matchRole;
    });

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h1 style={styles.pageTitle}>Admin Users</h1>
                    <p style={styles.subtitle}>{users.length} total users</p>
                </div>
                <button onClick={openCreate} style={styles.primaryBtn}>
                    + Add User
                </button>
            </div>

            {/* Filter bar */}
            <div style={styles.filterBar}>
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={styles.searchInput}
                />
                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value as any)}
                    style={styles.select}
                >
                    <option value="all">All Roles</option>
                    <option value="manager">Manager</option>
                    <option value="cashier">Cashier</option>
                </select>
                <button onClick={fetchUsers} style={styles.refreshBtn}>
                    🔄 Refresh
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
                                <th style={styles.th}>Name</th>
                                <th style={styles.th}>Email</th>
                                <th style={styles.th}>Role</th>
                                <th style={styles.th}>Address</th>
                                <th style={styles.th}>Birth Date</th>
                                <th style={styles.th}>Salary</th>
                                <th style={styles.th}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((u) => (
                                <tr key={u.id} style={styles.tr}>
                                    <td style={styles.td}>
                                        <strong>{u.name}</strong>
                                    </td>
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
                                        {u.address || <em style={{ color: "#999" }}>-</em>}
                                    </td>
                                    <td style={styles.td}>{formatDate(u.birth_of_date)}</td>
                                    <td style={styles.td}>
                                        <strong style={{ color: "#2ecc71" }}>
                                            {formatRupiah(u.salary)}
                                        </strong>
                                    </td>
                                    <td style={styles.td}>
                                        <button onClick={() => openEdit(u)} style={styles.editBtn}>
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(u.id, u.name)}
                                            style={styles.deleteBtn}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={7} style={styles.emptyTd}>
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
                        <div style={styles.modalHeader}>
                            <h2 style={{ margin: 0 }}>
                                {editing ? "Edit User" : "Add New User"}
                            </h2>
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
                            placeholder="John Doe"
                        />

                        <label style={styles.label}>Email *</label>
                        <input
                            type="email"
                            required
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            style={styles.input}
                            placeholder="user@example.com"
                        />

                        <label style={styles.label}>
                            Password {editing && <em style={{ color: "#999", fontWeight: 400 }}>
                                (leave empty to keep current)
                            </em>}
                        </label>
                        <input
                            type="password"
                            required={!editing}
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            style={styles.input}
                            placeholder={editing ? "•••••• (unchanged)" : "Min 6 characters"}
                        />

                        <label style={styles.label}>Role *</label>
                        <select
                            value={form.role}
                            onChange={(e) =>
                                setForm({ ...form, role: e.target.value as UserRole })
                            }
                            style={styles.input}
                        >
                            <option value="cashier">Cashier</option>
                            <option value="manager">Manager</option>
                        </select>

                        <div style={styles.row}>
                            <div style={{ flex: 1 }}>
                                <label style={styles.label}>Birth Date</label>
                                <input
                                    type="date"
                                    value={form.birth_of_date}
                                    onChange={(e) =>
                                        setForm({ ...form, birth_of_date: e.target.value })
                                    }
                                    style={styles.input}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={styles.label}>Salary (Rp)</label>
                                <input
                                    type="number"
                                    min={0}
                                    value={form.salary}
                                    onChange={(e) => setForm({ ...form, salary: e.target.value })}
                                    style={styles.input}
                                    placeholder="5000000"
                                />
                            </div>
                        </div>

                        <label style={styles.label}>Address</label>
                        <textarea
                            value={form.address}
                            onChange={(e) => setForm({ ...form, address: e.target.value })}
                            style={{ ...styles.input, minHeight: 60, resize: "vertical" }}
                            placeholder="Jl. Sudirman No. 1, Jakarta"
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
    filterBar: { display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" },
    searchInput: {
        flex: 1,
        minWidth: 240,
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
        overflow: "auto",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    },
    table: { width: "100%", borderCollapse: "collapse", minWidth: 800 },
    thRow: { background: "#1a1a1a", color: "#fff" },
    th: { padding: 12, textAlign: "left", fontSize: 13, whiteSpace: "nowrap" },
    tr: { borderBottom: "1px solid #eee" },
    td: { padding: 12, fontSize: 14 },
    emptyTd: { padding: 32, textAlign: "center", color: "#999" },
    badge: {
        padding: "4px 10px",
        borderRadius: 12,
        fontSize: 12,
        textTransform: "uppercase",
        fontWeight: 600,
        display: "inline-block",
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
        maxWidth: 500,
        maxHeight: "90vh",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
    },
    modalHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
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
    row: { display: "flex", gap: 10 },
    btnGroup: { display: "flex", gap: 8, marginTop: 18 },
};

export default AdminManagementPage;