import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Box, Typography, Skeleton, Button } from "@mui/material";
import { getImageUrl } from "../services/api";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface MenuItem {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
}

interface Package {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
}

const ItemPackageChoice = () => {
    const { itemId, sectionId } = useParams<{ itemId: string; sectionId: string }>();
    const navigate = useNavigate();

    const [item, setItem] = useState<MenuItem | null>(null);
    const [pkg, setPkg] = useState<Package | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!itemId) return;

        Promise.all([
            fetch(`${BASE_URL}/menu/${itemId}`)
                .then((r) => r.json())
                .then((d) => {
                    console.log("item response:", d); // debug
                    return d.data as MenuItem;
                }),

            fetch(`${BASE_URL}/menu?isPackage=true`)
                .then((r) => r.json())
                .then((d) => {
                    const packages = d.data ?? [];
                    return (
                        packages.find((p: any) =>
                            p.packages?.some((pi: any) => pi.packageItemId === itemId)
                        ) ?? null
                    );
                }),
        ])
            .then(([itemData, pkgData]) => {
                setItem(itemData);
                setPkg(pkgData);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [itemId]);

    const handleChoose = (chosenId: string, chosenName: string) => {
        console.log("Add to cart:", chosenId, chosenName);
        navigate(`/employee/category/${sectionId}`);
    };

    const formatPrice = (price: number) =>
        `Rp${price?.toLocaleString("id-ID") ?? 0}`;

    return (
        <Box
            sx={{
                position: "fixed",
                inset: 0,
                zIndex: 1200,
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* Background blur */}
            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    bgcolor: "rgba(255,255,255,0.6)",
                    backdropFilter: "blur(6px)",
                }}
            />

            {/* Content */}
            <Box
                sx={{
                    position: "relative",
                    zIndex: 1,
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    px: 4,
                    py: 3,
                }}
            >
                {/* Top bar — item name */}
                <Typography sx={{ fontSize: 13, color: "#555", mb: 2, fontWeight: 700 }}>
                    1pc {item?.name ?? ""}
                </Typography>

                {/* Pertanyaan */}
                <Typography
                    sx={{
                        fontSize: 32,
                        fontWeight: 700,
                        color: "#111",
                        lineHeight: 1.2,
                        mb: 4,
                        maxWidth: 400,
                    }}
                >
                    {pkg
                        ? "Mau tambah kentang atau minuman?"
                        : "Tambahkan ke pesanan?"}
                </Typography>

                {/* Kartu pilihan */}
                {loading ? (
                    <Box display="flex" gap={2} flex={1}>
                        <Skeleton variant="rectangular" sx={{ flex: 1, borderRadius: 3, height: 280 }} />
                        <Skeleton variant="rectangular" sx={{ flex: 1, borderRadius: 3, height: 280 }} />
                    </Box>
                ) : (
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: pkg ? "1fr 1fr" : "1fr",
                            gap: 2,
                            flex: 1,
                            maxHeight: 340,
                        }}
                    >
                        {/* PAKET */}
                        {pkg && (
                            <Box
                                onClick={() => handleChoose(pkg.id, pkg.name)}
                                sx={{
                                    border: "1.5px solid #ddd",
                                    borderRadius: 3,
                                    overflow: "hidden",
                                    bgcolor: "white",
                                    cursor: "pointer",
                                    display: "flex",
                                    flexDirection: "column",
                                    "&:hover": { boxShadow: "0 4px 20px rgba(0,0,0,0.15)" },
                                }}
                            >
                                <Box
                                    component="img"
                                    src={getImageUrl(pkg.imageUrl) || "/placeholder.png"}
                                    alt={pkg.name}
                                    sx={{
                                        width: "100%",
                                        height: 280,        // ← fix height
                                        objectFit: "cover",
                                        bgcolor: "#E8F5F0",
                                        display: "block",
                                    }}
                                />
                                <Box sx={{ p: 2 }}>
                                    <Typography sx={{ fontSize: 15, fontWeight: 700 }}>
                                        Iya, jadikan paket
                                    </Typography>
                                    {/* ← hapus harga di sini */}
                                </Box>
                            </Box>
                        )}

                        {/* SATUAN */}
                        <Box
                            onClick={() => item && handleChoose(item.id, item.name)}
                            sx={{
                                border: "1.5px solid #ddd",
                                borderRadius: 3,
                                overflow: "hidden",
                                bgcolor: "white",
                                cursor: "pointer",
                                display: "flex",
                                flexDirection: "column",
                                "&:hover": { boxShadow: "0 4px 20px rgba(0,0,0,0.15)" },
                            }}
                        >
                            <Box
                                component="img"
                                src={getImageUrl(item?.imageUrl) || "/placeholder.png"}
                                alt={item?.name}
                                sx={{
                                    width: "100%",
                                    height: 280,        // ← fix height sama
                                    objectFit: "cover",
                                    bgcolor: "#E8F5F0",
                                    display: "block",
                                }}
                            />
                            <Box sx={{ p: 2 }}>
                                <Typography sx={{ fontSize: 15, fontWeight: 700 }}>
                                    Tidak, satuan saja
                                </Typography>
                                <Typography sx={{ fontSize: 14, color: "#555" }}>
                                    {formatPrice(item?.price ?? 0)}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                )}

                {/* Batal — full width di bawah */}
                <Button
                    onClick={() => navigate(`/employee/category/${sectionId}`)}
                    fullWidth
                    variant="outlined"
                    sx={{
                        mt: 3,
                        borderRadius: 2,
                        textTransform: "none",
                        fontSize: 15,
                        color: "#555",
                        borderColor: "#ddd",
                        py: 1.5,
                        "&:hover": { bgcolor: "#f5f5f5", borderColor: "#ccc" },
                    }}
                >
                    Batal
                </Button>
            </Box>
        </Box>
    );
};

export default ItemPackageChoice;