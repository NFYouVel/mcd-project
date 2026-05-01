import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { createPortal } from "react-dom";
import { Box, Typography, Button, Checkbox, FormControlLabel } from "@mui/material";
import { getImageUrl } from "../services/api";
import { useAppDispatch } from "../store/index";
import { addToCart } from "../store/cartSlice";
import type { IngredientDetail, VariantDetail } from "../store/cartSlice";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ── Must be outside component so useEffect can reference it without stale closure ──
const BURGER_FILTERS = ["Sapi", "Ikan", "Ayam"];

// ====================== TYPES ======================
interface VariantItem {
    id: string;
    name: string;
    priceModifier: number;
}

interface VariantGroup {
    id: string;
    name: string;
    variantItems: VariantItem[];
}

interface Ingredient {
    id: string;
    name: string;
    price: number;
}

interface PackageItem {
    id: string;
    packageItemId: string;
    quantity: number;
}

interface MenuDetail {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    isPackage: boolean;
    filterMenu?: { id: string; name: string };
    packages: PackageItem[];
}

// ====================== COMPONENT ======================
const ItemCustomization = () => {
    const { menuId, sectionId } = useParams<{ menuId: string; sectionId: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [menu, setMenu] = useState<MenuDetail | null>(null);
    const [variantGroups, setVariantGroups] = useState<VariantGroup[]>([]);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [showModifikasi, setShowModifikasi] = useState(false);
    const [loading, setLoading] = useState(true);

    // ── User selections ──
    const [selectedVariants, setSelectedVariants] = useState<Record<string, string[]>>({});
    const [ingredientQty, setIngredientQty] = useState<Record<string, number>>({});
    const [specialRequests, setSpecialRequests] = useState<string[]>([]);

    const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
    };

    const fetchIngredients = () =>
        fetch(`${BASE_URL}/ingredient`, { headers })
            .then(r => r.json())
            .then(d => {
                const allIngredients: Ingredient[] = d.data ?? [];
                setIngredients(allIngredients);
                const defaults: Record<string, number> = {};
                allIngredients.forEach(ing => { defaults[ing.id] = 1; });
                setIngredientQty(defaults);
            });

    useEffect(() => {
        if (!menuId) return;

        Promise.all([
            fetch(`${BASE_URL}/menu/${menuId}`, { headers })
                .then(r => r.json())
                .then(d => d.data as MenuDetail),
            fetch(`${BASE_URL}/variantgroup/menu/${menuId}`, { headers })
                .then(r => r.json())
                .then(d => (d.data as VariantGroup[]) ?? []),
        ])
            .then(([menuData, menuVariants]) => {
                setMenu(menuData);
                setVariantGroups(menuVariants);

                // Chicken — has variant groups, no ingredient fetch needed
                if (menuVariants.length > 0) return;

                // Package — fetch each child to check if any is a burger
                if (menuData.isPackage && menuData.packages.length > 0) {
                    return Promise.all(
                        menuData.packages.map((pkg: PackageItem) =>
                            fetch(`${BASE_URL}/menu/${pkg.packageItemId}`, { headers })
                                .then(r => r.json())
                                .then(d => d.data as MenuDetail)
                        )
                    ).then(packageMenus => {
                        const hasBurgerChild = packageMenus.some(m =>
                            BURGER_FILTERS.includes(m.filterMenu?.name ?? "")
                        );
                        if (hasBurgerChild) return fetchIngredients();
                    });
                }

                // Standalone burger
                if (BURGER_FILTERS.includes(menuData.filterMenu?.name ?? "")) {
                    return fetchIngredients();
                }

                // Everything else (McFlurry, drinks, etc.) — no fetch
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [menuId]);

    // ── Derived state ──
    const isChicken = variantGroups.length > 0;
    const isBurger = !isChicken && BURGER_FILTERS.includes(menu?.filterMenu?.name ?? "");
    const isPackage = menu?.isPackage === true;
    const hasIngredients = ingredients.length > 0;

    // Show Modifikasi button only when there's actually something to modify
    const hasModifications = isChicken || hasIngredients;

    const formatPrice = (p: number) => `Rp${p?.toLocaleString("id-ID")}`;

    // ── Toggle helpers ──
    const toggleVariant = (groupId: string, itemId: string) => {
        setSelectedVariants(prev => {
            const current = prev[groupId] ?? [];
            const already = current.includes(itemId);
            return {
                ...prev,
                [groupId]: already ? current.filter(id => id !== itemId) : [...current, itemId],
            };
        });
    };

    const toggleSpecial = (name: string) => {
        setSpecialRequests(prev =>
            prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]
        );
    };

    const adjustIngredient = (id: string, delta: number) => {
        setIngredientQty(prev => ({
            ...prev,
            [id]: Math.max(0, (prev[id] ?? 1) + delta),
        }));
    };

    const resetSelections = () => {
        setSelectedVariants({});
        setSpecialRequests([]);
        const defaults: Record<string, number> = {};
        ingredients.forEach(ing => { defaults[ing.id] = 1; });
        setIngredientQty(defaults);
    };

    // ── Build modification summaries for cart ──
    const buildIngredientDetails = (): IngredientDetail[] =>
        ingredients
            .filter(ing => (ingredientQty[ing.id] ?? 1) > 0)
            .map(ing => ({
                id: ing.id,
                name: ing.name,
                quantity: ingredientQty[ing.id] ?? 1,
            }));

    const buildVariantDetails = (): VariantDetail[] => {
        const result: VariantDetail[] = [];
        variantGroups.forEach(group => {
            const selected = selectedVariants[group.id] ?? [];
            selected.forEach(itemId => {
                const vi = group.variantItems.find(v => v.id === itemId);
                if (vi) result.push({ id: vi.id, name: vi.name, groupName: group.name });
            });
        });
        return result;
    };

    // ── Add to Redux cart ──
    const handleAddToCart = () => {
        if (!menu) return;
        dispatch(addToCart({
            menuId: menu.id,
            name: menu.name,
            price: menu.price,
            imageUrl: menu.imageUrl ?? null,
            ingredients: hasIngredients ? buildIngredientDetails() : [],
            variants: isChicken ? buildVariantDetails() : [],
            specialRequests,
        }));
        navigate(`/employee/category/${sectionId}`);
    };

    // ====================== DETAIL PAGE ======================
    const DetailPage = () => (
        <Box
            sx={{
                position: "fixed",
                inset: 0,
                zIndex: 9999,
                bgcolor: "white",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <Box
                component="img"
                src={getImageUrl(menu?.imageUrl) || "/placeholder.png"}
                alt={menu?.name}
                sx={{
                    width: "100%",
                    height: "35%",
                    objectFit: "cover",
                    bgcolor: "#f5f5f5",
                }}
                onError={(e: any) => { e.target.src = "/placeholder.png"; }}
            />

            <Box sx={{ width: "100%", px: 4, py: 3, flex: 1 }}>
                <Typography sx={{ fontSize: 20, fontWeight: 700, mb: 0.5 }}>
                    {isPackage ? "" : "1pc "}{menu?.name}
                </Typography>
                <Typography sx={{ fontSize: 14, color: "#888", mb: 3 }}>
                    {formatPrice(menu?.price ?? 0)}
                </Typography>

                {hasModifications && (
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => setShowModifikasi(true)}
                        sx={{
                            borderRadius: 2,
                            textTransform: "none",
                            fontSize: 14,
                            color: "#333",
                            borderColor: "#ddd",
                            py: 1.5,
                            mb: 2,
                        }}
                    >
                        Modifikasi
                    </Button>
                )}
            </Box>

            <Box sx={{ width: "100%", px: 4, pb: 4, display: "flex", gap: 2 }}>
                <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => navigate(-1)}
                    sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontSize: 14,
                        color: "#555",
                        borderColor: "#ddd",
                        py: 1.5,
                    }}
                >
                    Batal
                </Button>
                <Button
                    fullWidth
                    variant="contained"
                    onClick={handleAddToCart}
                    sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontSize: 14,
                        fontWeight: 700,
                        bgcolor: "#FFC72C",
                        color: "#000",
                        py: 1.5,
                        "&:hover": { bgcolor: "#ffb300" },
                    }}
                >
                    Tambah pada Pesanan
                </Button>
            </Box>
        </Box>
    );

    // ====================== MODIFIKASI PAGE ======================
    const ModifikasiPage = () => (
        <Box
            sx={{
                position: "fixed",
                inset: 0,
                zIndex: 10000,
                bgcolor: "white",
                display: "flex",
                flexDirection: "column",
                overflowY: "auto",
            }}
        >
            <Typography
                sx={{
                    fontSize: 26,
                    fontWeight: 700,
                    textAlign: "center",
                    pt: 4,
                    pb: 2,
                    px: 4,
                }}
            >
                Modifikasi
            </Typography>

            <Box sx={{ px: 3, flex: 1 }}>
                {/* Item info card */}
                <Box
                    sx={{
                        border: "1px solid #eee",
                        borderRadius: 2,
                        p: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 3,
                    }}
                >
                    <Box
                        component="img"
                        src={getImageUrl(menu?.imageUrl) || "/placeholder.png"}
                        alt={menu?.name}
                        sx={{ width: 48, height: 48, objectFit: "cover", borderRadius: 1 }}
                        onError={(e: any) => { e.target.src = "/placeholder.png"; }}
                    />
                    <Box>
                        <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                            {isPackage ? "" : "1pc "}{menu?.name}
                        </Typography>
                        <Typography sx={{ fontSize: 13, color: "#888" }}>
                            {formatPrice(menu?.price ?? 0)}
                        </Typography>
                    </Box>

                    <Button
                        variant="outlined"
                        onClick={resetSelections}
                        sx={{
                            ml: "auto",
                            textTransform: "none",
                            fontSize: 12,
                            color: "#555",
                            borderColor: "#ddd",
                            borderRadius: 2,
                            py: 0.5,
                            px: 1.5,
                            flexShrink: 0,
                        }}
                    >
                        Hapus Perubahan
                    </Button>
                </Box>

                {/* ── BURGER / PACKAGE with burger child: ingredient steppers ── */}
                {hasIngredients && (
                    <Box sx={{ border: "1px solid #eee", borderRadius: 2, p: 2, mb: 3 }}>
                        <Typography sx={{ fontSize: 14, fontWeight: 700, mb: 2, color: "#555" }}>
                            Tersedia dengan
                        </Typography>
                        {ingredients.map((ing) => {
                            const qty = ingredientQty[ing.id] ?? 1;
                            return (
                                <Box
                                    key={ing.id}
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="space-between"
                                    py={1.2}
                                    sx={{ borderBottom: "1px solid #f5f5f5" }}
                                >
                                    <Typography sx={{ fontSize: 14 }}>{ing.name}</Typography>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Box
                                            onClick={() => adjustIngredient(ing.id, -1)}
                                            sx={{
                                                width: 28, height: 28,
                                                border: "1.5px solid #ddd",
                                                borderRadius: "50%",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                cursor: "pointer", fontSize: 16, color: "#555",
                                                userSelect: "none",
                                                "&:hover": { bgcolor: "#f5f5f5" },
                                            }}
                                        >
                                            −
                                        </Box>
                                        <Typography sx={{ fontSize: 14, fontWeight: 600, minWidth: 20, textAlign: "center" }}>
                                            {qty}
                                        </Typography>
                                        <Box
                                            onClick={() => adjustIngredient(ing.id, 1)}
                                            sx={{
                                                width: 28, height: 28,
                                                border: "1.5px solid #ddd",
                                                borderRadius: "50%",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                cursor: "pointer", fontSize: 16, color: "#555",
                                                userSelect: "none",
                                                "&:hover": { bgcolor: "#f5f5f5" },
                                            }}
                                        >
                                            +
                                        </Box>
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>
                )}

                {/* ── CHICKEN: variant group checkboxes ── */}
                {isChicken && variantGroups.map((group) => (
                    <Box
                        key={group.id}
                        sx={{ border: "1px solid #eee", borderRadius: 2, p: 2, mb: 3 }}
                    >
                        <Typography sx={{ fontSize: 14, fontWeight: 700, mb: 2, color: "#555" }}>
                            {group.name}
                        </Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                            {(group.variantItems ?? []).map((vi) => (
                                <FormControlLabel
                                    key={vi.id}
                                    control={
                                        <Checkbox
                                            checked={(selectedVariants[group.id] ?? []).includes(vi.id)}
                                            onChange={() => toggleVariant(group.id, vi.id)}
                                            size="small"
                                            sx={{ color: "#ddd", "&.Mui-checked": { color: "#222" } }}
                                        />
                                    }
                                    label={<Typography sx={{ fontSize: 13 }}>{vi.name}</Typography>}
                                />
                            ))}
                        </Box>
                    </Box>
                ))}

                {/* ── Permintaan Khusus — only for standalone burger or chicken, not packages ── */}
                {(isBurger || isChicken) && (
                    <Box sx={{ border: "1px solid #eee", borderRadius: 2, p: 2, mb: 3 }}>
                        <Typography sx={{ fontSize: 14, fontWeight: 700, mb: 1.5, color: "#555" }}>
                            Permintaan Khusus
                        </Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                            {["Plain"].map((req) => (
                                <FormControlLabel
                                    key={req}
                                    control={
                                        <Checkbox
                                            checked={specialRequests.includes(req)}
                                            onChange={() => toggleSpecial(req)}
                                            size="small"
                                            sx={{ color: "#ddd", "&.Mui-checked": { color: "#222" } }}
                                        />
                                    }
                                    label={<Typography sx={{ fontSize: 13 }}>{req}</Typography>}
                                />
                            ))}
                        </Box>
                    </Box>
                )}
            </Box>

            {/* Bottom buttons */}
            <Box sx={{ px: 3, pb: 4, pt: 2, display: "flex", gap: 2 }}>
                <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => setShowModifikasi(false)}
                    sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontSize: 14,
                        color: "#555",
                        borderColor: "#ddd",
                        py: 1.5,
                    }}
                >
                    Batalkan Perubahan
                </Button>
                <Button
                    fullWidth
                    variant="contained"
                    onClick={() => setShowModifikasi(false)}
                    sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontSize: 14,
                        fontWeight: 700,
                        bgcolor: "#FFC72C",
                        color: "#000",
                        py: 1.5,
                        "&:hover": { bgcolor: "#ffb300" },
                    }}
                >
                    Simpan Perubahan
                </Button>
            </Box>
        </Box>
    );

    return createPortal(
        <>
            {!loading && <DetailPage />}
            {showModifikasi && <ModifikasiPage />}
        </>,
        document.body
    );
};

export default ItemCustomization;