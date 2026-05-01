import { useNavigate } from "react-router";
import { Box, Typography, IconButton, Button, Divider } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../store/index";
import {
    incrementItem,
    decrementItem,
    removeFromCart,
} from "../store/cartSlice";
import { getImageUrl } from "../services/api";

// ====================== HELPERS ======================
const formatPrice = (price: number) =>
    `Rp${price?.toLocaleString("id-ID") ?? 0}`;

// ====================== COMPONENT ======================
const ItemCart = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const cartItems = useAppSelector((state) => state.cart.items);

    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

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
                        <Box key={item.menuId}>
                            <Box sx={{ display: "flex", alignItems: "center", py: 1.5, gap: 2 }}>
                                {/* Hapus */}
                                <Button
                                    onClick={() => dispatch(removeFromCart(item.menuId))}
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
                                    }}
                                >
                                    Hapus
                                </Button>

                                {/* Image */}
                                <Box
                                    component="img"
                                    src={getImageUrl(item.imageUrl) || "/placeholder.png"}
                                    alt={item.name}
                                    sx={{ width: 56, height: 56, objectFit: "contain", flexShrink: 0 }}
                                    onError={(e: any) => { e.target.src = "/placeholder.png"; }}
                                />

                                {/* Name */}
                                <Typography
                                    sx={{ flex: 1, fontSize: 13, fontWeight: 600, color: "#111", lineHeight: 1.3 }}
                                >
                                    {item.name}
                                </Typography>

                                {/* Quantity controls */}
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        border: "1px solid #ddd",
                                        borderRadius: 1.5,
                                        overflow: "hidden",
                                        flexShrink: 0,
                                    }}
                                >
                                    <IconButton
                                        size="small"
                                        onClick={() => dispatch(decrementItem(item.menuId))}
                                        sx={{ borderRadius: 0, px: 1, py: 0.5 }}
                                    >
                                        <Remove sx={{ fontSize: 14 }} />
                                    </IconButton>
                                    <Typography
                                        sx={{ px: 1.5, fontSize: 14, fontWeight: 700, minWidth: 24, textAlign: "center" }}
                                    >
                                        {item.quantity}
                                    </Typography>
                                    <IconButton
                                        size="small"
                                        onClick={() => dispatch(incrementItem(item.menuId))}
                                        sx={{ borderRadius: 0, px: 1, py: 0.5 }}
                                    >
                                        <Add sx={{ fontSize: 14 }} />
                                    </IconButton>
                                </Box>

                                {/* Price */}
                                <Typography
                                    sx={{ fontSize: 13, fontWeight: 600, color: "#111", minWidth: 80, textAlign: "right", flexShrink: 0 }}
                                >
                                    {formatPrice(item.price * item.quantity)}
                                </Typography>
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
                    onClick={() => navigate("/employee/checkout")}
                    variant="contained"
                    disabled={cartItems.length === 0}
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
                    Selesaikan Pesanan
                </Button>
            </Box>
        </Box>
    );
};

export default ItemCart;