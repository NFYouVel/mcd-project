// src/pages/MenuManagementPage.tsx
import { useEffect, useState, useRef } from "react";
import { menuService, filterMenuService, type Menu, type FilterMenu, type MenuPayload } from "../services/menuServices";
import { getImageUrl } from "../services/api";

const initialForm: MenuPayload = {
    name: "",
    description: "",
    price: 0,
    isNew: true,
    isAvailable: true,
    isPackage: false,
    imageFile: null,
    imageUrl: "",
    filterMenuId: "",
};

const formatRupiah = (n: number) => `Rp ${Number(n).toLocaleString("id-ID")}`;

const MenuManagementPage = () => {
    const [menus, setMenus] = useState<Menu[]>([]);
    const [filters, setFilters] = useState<FilterMenu[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<Menu | null>(null);
    const [form, setForm] = useState<MenuPayload>(initialForm);
    const [previewUrl, setPreviewUrl] = useState<string>(""); // local blob preview
    const [submitError, setSubmitError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const [search, setSearch] = useState("");
    const [filterBy, setFilterBy] = useState<string>("all");

    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchData = async () => {
        setLoading(true);
        setError("");
        try {
            const [menuData, filterData] = await Promise.all([
                menuService.getAll(),
                filterMenuService.getAll(),
            ]);
            setMenus(menuData);
            setFilters(filterData);
        } catch (err: any) {
            setError(err.message || "Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Cleanup preview URL saat unmount
    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl.startsWith("blob:")) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const openCreate = () => {
        setEditing(null);
        setForm({
            ...initialForm,
            filterMenuId: filters[0]?.id || "",
        });
        setPreviewUrl("");
        setSubmitError("");
        setShowModal(true);
    };

    const openEdit = (menu: Menu) => {
        setEditing(menu);
        setForm({
            name: menu.name,
            description: menu.description || "",
            price: menu.price,
            isNew: menu.isNew,
            isAvailable: menu.isAvailable,
            isPackage: menu.isPackage,
            imageFile: null,
            imageUrl: menu.imageUrl || "",
            filterMenuId: menu.filterMenuId,
        });
        setPreviewUrl(getImageUrl(menu.imageUrl));
        setSubmitError("");
        setShowModal(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validasi tipe file
        const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        if (!allowed.includes(file.type)) {
            setSubmitError("File must be an image (jpeg, png, webp)");
            return;
        }

        // Validasi ukuran (10MB)
        if (file.size > 10 * 1024 * 1024) {
            setSubmitError("File size max 10MB");
            return;
        }

        setSubmitError("");

        // Cleanup preview lama
        if (previewUrl && previewUrl.startsWith("blob:")) {
            URL.revokeObjectURL(previewUrl);
        }

        setForm({ ...form, imageFile: file, imageUrl: "" });
        setPreviewUrl(URL.createObjectURL(file));
    };

    const clearImage = () => {
        if (previewUrl && previewUrl.startsWith("blob:")) {
            URL.revokeObjectURL(previewUrl);
        }
        setForm({ ...form, imageFile: null, imageUrl: "" });
        setPreviewUrl("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError("");

        if (!form.filterMenuId) {
            return setSubmitError("Please select a filter category");
        }
        if (form.price < 0) {
            return setSubmitError("Price must be non-negative");
        }

        setSubmitting(true);
        try {
            if (editing) {
                await menuService.update(editing.id, form);
            } else {
                await menuService.create(form);
            }
            setShowModal(false);
            await fetchData();
        } catch (err: any) {
            setSubmitError(err.message || "Failed to save menu");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Delete "${name}"?`)) return;
        try {
            await menuService.delete(id);
            await fetchData();
        } catch (err: any) {
            alert(err.message || "Failed to delete menu");
        }
    };

    const filtered = menus.filter((m) => {
        const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filterBy === "all" || m.filterMenuId === filterBy;
        return matchSearch && matchFilter;
    });

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h1 style={styles.pageTitle}>Menu Management</h1>
                    <p style={styles.subtitle}>{menus.length} total items</p>
                </div>
                <button onClick={openCreate} style={styles.primaryBtn}>
                    + Add Menu
                </button>
            </div>

            {/* Filter bar */}
            <div style={styles.filterBar}>
                <input
                    type="text"
                    placeholder="Search menu name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={styles.searchInput}
                />
                <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value)}
                    style={styles.select}
                >
                    <option value="all">All Categories</option>
                    {filters.map((f) => (
                        <option key={f.id} value={f.id}>
                            {f.name}
                        </option>
                    ))}
                </select>
                <button onClick={fetchData} style={styles.refreshBtn}>
                    🔄 Refresh
                </button>
            </div>

            {error && <div style={styles.errorBox}>{error}</div>}

            {loading ? (
                <p>Loading menus...</p>
            ) : (
                <div style={styles.grid}>
                    {filtered.map((menu) => (
                        <div key={menu.id} style={styles.card}>
                            <div style={styles.imageWrap}>
                                {menu.imageUrl ? (
                                    <img
                                        src={getImageUrl(menu.imageUrl)}
                                        alt={menu.name}
                                        style={styles.image}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = "none";
                                        }}
                                    />
                                ) : (
                                    <div style={styles.imagePlaceholder}>🍔</div>
                                )}

                                <div style={styles.badgeStack}>
                                    {menu.isNew && (
                                        <span style={{ ...styles.badge, background: "#FFC72C", color: "#000" }}>
                                            NEW
                                        </span>
                                    )}
                                    {menu.isPackage && (
                                        <span style={{ ...styles.badge, background: "#9b59b6" }}>PACKAGE</span>
                                    )}
                                    {!menu.isAvailable && (
                                        <span style={{ ...styles.badge, background: "#e74c3c" }}>SOLD OUT</span>
                                    )}
                                </div>
                            </div>

                            <div style={styles.cardBody}>
                                <h3 style={styles.cardTitle}>{menu.name}</h3>
                                <p style={styles.cardDesc}>
                                    {menu.description || <em style={{ color: "#999" }}>No description</em>}
                                </p>
                                <div style={styles.cardMeta}>
                                    <strong style={styles.price}>{formatRupiah(menu.price)}</strong>
                                    <span style={styles.categoryTag}>
                                        {menu.filterMenu?.name ||
                                            filters.find((f) => f.id === menu.filterMenuId)?.name ||
                                            "—"}
                                    </span>
                                </div>
                            </div>

                            <div style={styles.cardActions}>
                                <button onClick={() => openEdit(menu)} style={styles.editBtn}>
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(menu.id, menu.name)}
                                    style={styles.deleteBtn}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}

                    {filtered.length === 0 && (
                        <div style={styles.empty}>
                            <p>No menus found</p>
                            {search && (
                                <p style={{ fontSize: 13, color: "#999" }}>Try different search term</p>
                            )}
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
                            <h2 style={{ margin: 0 }}>{editing ? "Edit Menu" : "Add New Menu"}</h2>
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
                            placeholder="Big Mac"
                        />

                        <label style={styles.label}>Description</label>
                        <textarea
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            style={{ ...styles.input, minHeight: 60, resize: "vertical" }}
                            placeholder="Tasty burger with..."
                        />

                        <div style={styles.row}>
                            <div style={{ flex: 1 }}>
                                <label style={styles.label}>Price (Rp) *</label>
                                <input
                                    type="number"
                                    required
                                    min={0}
                                    value={form.price}
                                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                                    style={styles.input}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={styles.label}>Filter Category *</label>
                                <select
                                    required
                                    value={form.filterMenuId}
                                    onChange={(e) => setForm({ ...form, filterMenuId: e.target.value })}
                                    style={styles.input}
                                >
                                    <option value="">-- Select Category --</option>
                                    {filters.map((f) => (
                                        <option key={f.id} value={f.id}>
                                            {f.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* IMAGE UPLOAD SECTION */}
                        <label style={styles.label}>Menu Image</label>
                        <div style={styles.uploadBox}>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                onChange={handleFileChange}
                                style={styles.fileInput}
                                id="menu-image-input"
                            />
                            <label htmlFor="menu-image-input" style={styles.uploadBtn}>
                                📁 Choose Image
                            </label>
                            <span style={styles.uploadHint}>
                                {form.imageFile
                                    ? form.imageFile.name
                                    : editing && form.imageUrl
                                        ? "Current image (choose new to replace)"
                                        : "JPEG, PNG, WebP (max 10MB)"}
                            </span>
                            {(previewUrl || form.imageFile) && (
                                <button type="button" onClick={clearImage} style={styles.clearBtn}>
                                    Clear
                                </button>
                            )}
                        </div>

                        {previewUrl && (
                            <div style={styles.preview}>
                                <img
                                    src={previewUrl}
                                    alt="preview"
                                    style={styles.previewImg}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = "none";
                                    }}
                                />
                            </div>
                        )}

                        <div style={styles.checkboxGroup}>
                            <label style={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={form.isAvailable}
                                    onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
                                />
                                <span>Available</span>
                            </label>
                            <label style={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={form.isNew}
                                    onChange={(e) => setForm({ ...form, isNew: e.target.checked })}
                                />
                                <span>Mark as New</span>
                            </label>
                            <label style={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={form.isPackage}
                                    onChange={(e) => setForm({ ...form, isPackage: e.target.checked })}
                                />
                                <span>Is Package</span>
                            </label>
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
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: 16,
    },
    empty: { gridColumn: "1 / -1", padding: 40, textAlign: "center", color: "#999" },
    card: {
        background: "#fff",
        borderRadius: 10,
        overflow: "hidden",
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
    },
    imageWrap: {
        position: "relative",
        width: "100%",
        height: 160,
        background: "#f5f5f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
    },
    image: { width: "100%", height: "100%", objectFit: "cover" },
    imagePlaceholder: { fontSize: 60, opacity: 0.3 },
    badgeStack: {
        position: "absolute",
        top: 8,
        left: 8,
        display: "flex",
        flexDirection: "column",
        gap: 4,
    },
    badge: {
        padding: "3px 8px",
        borderRadius: 10,
        color: "#fff",
        fontSize: 11,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    cardBody: { padding: 14, flex: 1 },
    cardTitle: { margin: "0 0 6px", fontSize: 16 },
    cardDesc: {
        margin: "0 0 10px",
        fontSize: 13,
        color: "#666",
        minHeight: 36,
        overflow: "hidden",
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
    },
    cardMeta: { display: "flex", justifyContent: "space-between", alignItems: "center" },
    price: { color: "#DA291C", fontSize: 16 },
    categoryTag: {
        background: "#f0f0f0",
        padding: "3px 8px",
        borderRadius: 8,
        fontSize: 11,
        color: "#666",
    },
    cardActions: { display: "flex", gap: 6, padding: 12, borderTop: "1px solid #eee" },
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
    row: { display: "flex", gap: 10 },
    // ↓ Upload styles
    uploadBox: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: 10,
        border: "1px dashed #ccc",
        borderRadius: 6,
        background: "#fafafa",
        flexWrap: "wrap",
    },
    fileInput: {
        display: "none",
    },
    uploadBtn: {
        padding: "8px 14px",
        background: "#3498db",
        color: "#fff",
        borderRadius: 6,
        cursor: "pointer",
        fontSize: 13,
        fontWeight: 600,
    },
    uploadHint: { fontSize: 12, color: "#666", flex: 1, minWidth: 120 },
    clearBtn: {
        padding: "6px 10px",
        background: "#e74c3c",
        color: "#fff",
        border: "none",
        borderRadius: 6,
        cursor: "pointer",
        fontSize: 12,
    },
    preview: {
        marginTop: 8,
        background: "#f5f5f5",
        borderRadius: 6,
        padding: 8,
        textAlign: "center",
    },
    previewImg: { maxHeight: 160, maxWidth: "100%", borderRadius: 4 },
    checkboxGroup: { display: "flex", gap: 16, marginTop: 16, flexWrap: "wrap" },
    checkboxLabel: {
        display: "flex",
        alignItems: "center",
        gap: 6,
        fontSize: 14,
        cursor: "pointer",
    },
    btnGroup: { display: "flex", gap: 8, marginTop: 20 },
};

export default MenuManagementPage;