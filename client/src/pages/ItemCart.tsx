import { useState } from "react";
import { useNavigate } from "react-router";
import { Box, Typography, IconButton, Button, Divider, CircularProgress } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../store/index";
import {
    incrementItem,
    decrementItem,
    removeFromCart,
    clearCart,
} from "../store/cartSlice";
import type { CartItem } from "../store/cartSlice";
import { getImageUrl } from "../services/api";

// ====================== HELPERS ======================
const formatPrice = (price: number) =>
    `Rp${price?.toLocaleString("id-ID") ?? 0}`;

const ModificationSummary = ({ item }: { item: CartItem }) => {
    const lines: string[] = [];

    if (item.ingredients.length > 0) {
        item.ingredients.forEach(ing => {
            if (ing.quantity === 0) {
                lines.push(`Tanpa ${ing.name}`);
            } else if (ing.quantity > 1) {
                lines.push(`${ing.name} ×${ing.quantity}`);
            }
        });
    }

    if (item.variants.length > 0) {
        const grouped: Record<string, string[]> = {};
        item.variants.forEach(v => {
            if (!grouped[v.groupName]) grouped[v.groupName] = [];
            grouped[v.groupName].push(v.name);
        });
        Object.entries(grouped).forEach(([groupName, names]) => {
            lines.push(`${groupName}: ${names.join(", ")}`);
        });
    }

    if (item.specialRequests.length > 0) {
        lines.push(item.specialRequests.join(", "));
    }

    if (lines.length === 0) return null;

    return (
        <Box sx={{ mt: 0.5 }}>
            {lines.map((line, i) => (
                <Typography key={i} sx={{ fontSize: 11, color: "#999", lineHeight: 1.5 }}>
                    {line}
                </Typography>
            ))}
        </Box>
    );
};

// ====================== COMPONENT ======================
const ItemCart = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const cartItems = useAppSelector((state) => state.cart.items);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const handleCheckout = async () => {
        setLoading(true);
        setError(null);
        try {
            const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

            const orderItems = cartItems.map((item) => ({
                menuId: item.menuId,
                variantItemsId: item.variants.length > 0 ? item.variants[0].id : null,
                ingredientItems: Array.isArray(item.ingredients)
                    ? item.ingredients.map((ing) => ({
                        ingredientsId: ing.id,
                        quantity: ing.quantity ?? 1,
                        price: 0,
                    }))
                    : [],
            }));

            const orderRes = await fetch(`${BASE}/orders`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderItems }),
            });

            if (!orderRes.ok) throw new Error("Failed to create order");

            dispatch(clearCart());
            navigate("/employee");
        } catch (err: any) {
            setError(err.message ?? "Gagal membuat pesanan. Silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100vh",
                bgcolor: "#fff",
            }}
        >
            {/* ── HEADER ── */}
            <Box sx={{ px: 3, pt: 3, pb: 2, display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                    component="img"
                    src="/mcdonalds-logo.png"
                    alt="logo"
                    sx={{ width: 40, height: 40, objectFit: "contain" }}
                    onError={(e: any) => { e.target.style.display = "none"; }}
                />
                <Typography sx={{ fontSize: 28, fontWeight: 800, color: "#111", letterSpacing: -0.5 }}>
                    Pesanan Anda
                </Typography>
            </Box>

            {/* ── ITEMS LIST ── */}
            <Box sx={{ flex: 1, overflowY: "auto", px: 3 }}>
                {cartItems.length === 0 ? (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "60%",
                            color: "#aaa",
                        }}
                    >
                        <Typography sx={{ fontSize: 18 }}>Belum ada pesanan</Typography>
                    </Box>
                ) : (
                    cartItems.map((item) => (
                        <Box key={item.cartItemId}>
                            <Box sx={{ display: "flex", alignItems: "flex-start", py: 1.5, gap: 2 }}>
                                <Button
                                    onClick={() => dispatch(removeFromCart(item.cartItemId))}
                                    sx={{
                                        minWidth: 0,
                                        px: 1.5,
                                        py: 0.5,
                                        fontSize: 11,
                                        color: "#555",
                                        border: "1px solid #ddd",
                                        borderRadius: 1.5,
                                        textTransform: "none",
                                        lineHeight: 1.3,
                                        flexShrink: 0,
                                        mt: 0.5,
                                    }}
                                >
                                    Hapus
                                </Button>

                                <Box
                                    component="img"
                                    src={getImageUrl(item.imageUrl) || "/placeholder.png"}
                                    alt={item.name}
                                    sx={{ width: 56, height: 56, objectFit: "contain", flexShrink: 0 }}
                                    onError={(e: any) => { e.target.src = "/placeholder.png"; }}
                                />

                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#111", lineHeight: 1.3 }}>
                                        {item.name}
                                    </Typography>
                                    <ModificationSummary item={item} />
                                </Box>

                                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 0.5, flexShrink: 0 }}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            border: "1px solid #ddd",
                                            borderRadius: 1.5,
                                            overflow: "hidden",
                                        }}
                                    >
                                        <IconButton
                                            size="small"
                                            onClick={() => dispatch(decrementItem(item.cartItemId))}
                                            sx={{ borderRadius: 0, px: 1, py: 0.5 }}
                                        >
                                            <Remove sx={{ fontSize: 14 }} />
                                        </IconButton>
                                        <Typography sx={{ px: 1.5, fontSize: 14, fontWeight: 700, minWidth: 24, textAlign: "center" }}>
                                            {item.quantity}
                                        </Typography>
                                        <IconButton
                                            size="small"
                                            onClick={() => dispatch(incrementItem(item.cartItemId))}
                                            sx={{ borderRadius: 0, px: 1, py: 0.5 }}
                                        >
                                            <Add sx={{ fontSize: 14 }} />
                                        </IconButton>
                                    </Box>
                                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#111", textAlign: "right" }}>
                                        {formatPrice(item.price * item.quantity)}
                                    </Typography>
                                </Box>
                            </Box>
                            <Divider />
                        </Box>
                    ))
                )}
            </Box>

            {/* ── TOTALS ── */}
            <Box sx={{ px: 3, pt: 2, pb: 1 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                    <Typography sx={{ fontSize: 13, color: "#777" }}>Sub total</Typography>
                    <Typography sx={{ fontSize: 13, color: "#777" }}>{formatPrice(subtotal)}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                    <Typography sx={{ fontSize: 20, fontWeight: 800, color: "#111" }}>Total</Typography>
                    <Typography sx={{ fontSize: 20, fontWeight: 800, color: "#111" }}>{formatPrice(subtotal)}</Typography>
                </Box>
            </Box>

            {/* ── ERROR ── */}
            {error && (
                <Typography sx={{ fontSize: 12, color: "red", textAlign: "center", px: 3, pb: 1 }}>
                    {error}
                </Typography>
            )}

            {/* ── ACTION BUTTONS ── */}
            <Box sx={{ px: 3, pb: 3, display: "grid", gridTemplateColumns: "1fr 2fr", gap: 1.5 }}>
                <Button
                    onClick={() => navigate(-1)}
                    variant="outlined"
                    sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontSize: 15,
                        fontWeight: 700,
                        color: "#111",
                        borderColor: "#ddd",
                        py: 2,
                        lineHeight: 1.3,
                        "&:hover": { bgcolor: "#f5f5f5", borderColor: "#ccc" },
                    }}
                >
                    Tambah<br />Pesanan
                </Button>

                <Button
                    onClick={handleCheckout}
                    variant="contained"
                    disabled={cartItems.length === 0 || loading}
                    sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontSize: 16,
                        fontWeight: 700,
                        bgcolor: "#FFBC0D",
                        color: "#111",
                        py: 2,
                        boxShadow: "none",
                        "&:hover": { bgcolor: "#e6a800", boxShadow: "none" },
                        "&:disabled": { bgcolor: "#eee", color: "#aaa" },
                    }}
                >
                    {loading
                        ? <CircularProgress size={22} sx={{ color: "#111" }} />
                        : "Selesaikan Pesanan"
                    }
                </Button>
            </Box>
        </Box>
    );
};

export default ItemCart;