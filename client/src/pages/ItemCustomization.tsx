import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { createPortal } from "react-dom";
import { Box, Typography, Button, Checkbox, FormControlLabel } from "@mui/material";
import { getImageUrl } from "../services/api";
import { useAppDispatch, useAppSelector } from "../store/index";
import { addToCart, updateCartItem } from "../store/cartSlice";
import type { IngredientDetail, VariantDetail } from "../store/cartSlice";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const BURGER_FILTERS = ["sapi", "ikan", "ayam"];
const CHICKEN_KEYWORDS = ["ayam krispy", "ayam spicy"];

const isChickenFilter = (name: string) =>
    CHICKEN_KEYWORDS.some(k => name.toLowerCase().includes(k));

const isBurgerFilter = (name: string) =>
    !isChickenFilter(name) && BURGER_FILTERS.some(f => name.toLowerCase().includes(f));

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

const ItemCustomization = () => {
    const { menuId, sectionId } = useParams<{ menuId: string; sectionId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();
    const cartItems = useAppSelector((state) => state.cart.items);

    const cartItemId = (location.state as { cartItemId?: string } | null)?.cartItemId ?? null;
    const isEditMode = !!cartItemId;
    const existingCartItem = cartItemId ? cartItems.find(i => i.cartItemId === cartItemId) : null;

    const [menu, setMenu] = useState<MenuDetail | null>(null);
    const [variantGroups, setVariantGroups] = useState<VariantGroup[]>([]);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [showModifikasi, setShowModifikasi] = useState(false);
    const [loading, setLoading] = useState(true);

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
                setIngredientQty(() => {
                    if (existingCartItem) {
                        const filled: Record<string, number> = {};
                        allIngredients.forEach(ing => {
                            const existing = existingCartItem.ingredients.find(i => i.id === ing.id);
                            filled[ing.id] = existing ? existing.quantity : 1;
                        });
                        return filled;
                    }
                    return defaults;
                });
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

                if (isEditMode && existingCartItem && menuVariants.length > 0) {
                    const preFilledVariants: Record<string, string[]> = {};
                    menuVariants.forEach(group => {
                        const selected = existingCartItem.variants
                            .filter(v => group.variantItems.some(vi => vi.id === v.id))
                            .map(v => v.id);
                        if (selected.length > 0) preFilledVariants[group.id] = selected;
                    });
                    setSelectedVariants(preFilledVariants);
                }

                if (isEditMode && existingCartItem) {
                    setSpecialRequests(existingCartItem.specialRequests ?? []);
                }

                if (menuVariants.length > 0) return;

                if (menuData.isPackage && menuData.packages.length > 0) {
                    return Promise.all(
                        menuData.packages.map((pkg: PackageItem) =>
                            fetch(`${BASE_URL}/menu/${pkg.packageItemId}`, { headers })
                                .then(r => r.json())
                                .then(d => d.data as MenuDetail)
                        )
                    ).then(packageMenus => {
                        const hasBurgerChild = packageMenus.some(m =>
                            isBurgerFilter(m.filterMenu?.name ?? "") &&
                            !isChickenFilter(m.filterMenu?.name ?? "")
                        );
                        if (hasBurgerChild) return fetchIngredients();
                    });
                }

                if (
                    isBurgerFilter(menuData.filterMenu?.name ?? "") &&
                    !isChickenFilter(menuData.filterMenu?.name ?? "")
                ) {
                    return fetchIngredients();
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [menuId]);


    const isChicken = variantGroups.length > 0 || isChickenFilter(menu?.filterMenu?.name ?? "");
    const isBurger = !isChicken && isBurgerFilter(menu?.filterMenu?.name ?? "") && !isChickenFilter(menu?.filterMenu?.name ?? "");
    const isPackage = menu?.isPackage === true;
    const hasIngredients = ingredients.length > 0;
    const hasModifications = isChicken || hasIngredients;

    const formatPrice = (p: number) => `Rp${p?.toLocaleString("id-ID")}`;

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

    const handleConfirm = () => {
        if (!menu) return;

        const variantExtraCost = variantGroups.reduce((sum, group) => {
            const selected = selectedVariants[group.id] ?? [];
            return sum + group.variantItems
                .filter(vi => selected.includes(vi.id))
                .reduce((s, vi) => s + vi.priceModifier, 0);
        }, 0);

        const ingredientExtraCost = ingredients.reduce((sum, ing) => {
            const qty = ingredientQty[ing.id] ?? 1;
            return sum + ing.price * (qty - 1);
        }, 0);

        const finalPrice = menu.price + variantExtraCost + ingredientExtraCost;

        if (isEditMode && cartItemId) {
            dispatch(updateCartItem({
                cartItemId,
                price: finalPrice,
                ingredients: hasIngredients ? buildIngredientDetails() : [],
                variants: isChicken ? buildVariantDetails() : [],
                specialRequests,
            }));
            navigate("/employee/cart");
        } else {
            dispatch(addToCart({
                menuId: menu.id,
                name: menu.name,
                price: finalPrice,
                imageUrl: menu.imageUrl ?? null,
                ingredients: hasIngredients ? buildIngredientDetails() : [],
                variants: isChicken ? buildVariantDetails() : [],
                specialRequests,
            }));
            navigate(`/employee/category/${sectionId}`);
        }
    };

    return createPortal(
        <>
            {/* ── DETAIL BACKDROP ── */}
            {!loading && (
                <Box sx={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 9998,
                    bgcolor: "rgba(0,0,0,0.4)",
                    backdropFilter: "blur(4px)",
                }} />
            )}

            {/* ── DETAIL PAGE ── */}
            {!loading && (
                <Box sx={{
                    position: "fixed",
                    zIndex: 9999,
                    bgcolor: "white",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "320px",
                    height: "fit-content",
                    maxHeight: "90vh",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    borderRadius: 3,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
                    overflow: "hidden",
                }}>
                    <Box
                        component="img"
                        src={getImageUrl(menu?.imageUrl) || "/placeholder.png"}
                        alt={menu?.name}
                        sx={{ width: "100%", height: "160px", objectFit: "cover", bgcolor: "#f5f5f5" }}
                        onError={(e: any) => { e.target.src = "/placeholder.png"; }}
                    />
                    <Box sx={{ width: "100%", px: 2.5, py: 1.5, flex: 1 }}>
                        <Typography sx={{ fontSize: 15, fontWeight: 700, mb: 0.3 }}>
                            {isPackage ? "" : "1pc "}{menu?.name}
                        </Typography>
                        <Typography sx={{ fontSize: 12, color: "#888", mb: 1.5 }}>
                            {formatPrice(menu?.price ?? 0)}
                        </Typography>
                        {hasModifications && (
                            <Button fullWidth variant="outlined" onClick={() => setShowModifikasi(true)}
                                sx={{ borderRadius: 2, textTransform: "none", fontSize: 12, color: "#333", borderColor: "#ddd", py: 1, mb: 1.5 }}>
                                Modifikasi
                            </Button>
                        )}
                    </Box>
                    <Box sx={{ width: "100%", px: 2.5, pb: 2.5, display: "flex", gap: 1.5 }}>
                        <Button fullWidth variant="outlined"
                            onClick={() => isEditMode ? navigate("/employee/cart") : navigate(-1)}
                            sx={{ borderRadius: 2, textTransform: "none", fontSize: 12, color: "#555", borderColor: "#ddd", py: 1 }}>
                            Batal
                        </Button>
                        <Button fullWidth variant="contained" onClick={handleConfirm}
                            sx={{ borderRadius: 2, textTransform: "none", fontSize: 12, fontWeight: 700, bgcolor: "#FFC72C", color: "#000", py: 1, "&:hover": { bgcolor: "#ffb300" } }}>
                            {isEditMode ? "Simpan Perubahan" : "Tambah pada Pesanan"}
                        </Button>
                    </Box>
                </Box>
            )}

            {/* ── MODIFIKASI BACKDROP ── */}
            {showModifikasi && (
                <Box sx={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 9999,
                    bgcolor: "rgba(0,0,0,0.4)",
                    backdropFilter: "blur(4px)",
                }} />
            )}

            {/* ── MODIFIKASI PAGE ── */}
            {showModifikasi && (
                <Box sx={{
                    position: "fixed",
                    zIndex: 10000,
                    bgcolor: "white",
                    display: "flex",
                    flexDirection: "column",
                    width: "320px",
                    maxHeight: "90vh",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    borderRadius: 3,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
                    overflowY: "auto",
                }}>
                    <Typography sx={{ fontSize: 18, fontWeight: 700, textAlign: "center", pt: 2.5, pb: 1.5, px: 3 }}>
                        Modifikasi
                    </Typography>
                    <Box sx={{ px: 2, flex: 1 }}>
                        {/* Item info card */}
                        <Box sx={{ border: "1px solid #eee", borderRadius: 2, p: 1.5, display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                            <Box component="img" src={getImageUrl(menu?.imageUrl) || "/placeholder.png"} alt={menu?.name}
                                sx={{ width: 40, height: 40, objectFit: "cover", borderRadius: 1 }}
                                onError={(e: any) => { e.target.src = "/placeholder.png"; }} />
                            <Box>
                                <Typography sx={{ fontSize: 12, fontWeight: 600 }}>{isPackage ? "" : "1pc "}{menu?.name}</Typography>
                                <Typography sx={{ fontSize: 11, color: "#888" }}>{formatPrice(menu?.price ?? 0)}</Typography>
                            </Box>
                            <Button variant="outlined" onClick={resetSelections}
                                sx={{ ml: "auto", textTransform: "none", fontSize: 10, color: "#555", borderColor: "#ddd", borderRadius: 2, py: 0.3, px: 1, flexShrink: 0 }}>
                                Hapus Perubahan
                            </Button>
                        </Box>

                        {/* Ingredients */}
                        {hasIngredients && (
                            <Box sx={{ border: "1px solid #eee", borderRadius: 2, p: 1.5, mb: 2 }}>
                                <Typography sx={{ fontSize: 12, fontWeight: 700, mb: 1.5, color: "#555" }}>Tersedia dengan</Typography>
                                {ingredients.map((ing) => {
                                    const qty = ingredientQty[ing.id] ?? 1;
                                    return (
                                        <Box key={ing.id} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 0.8, borderBottom: "1px solid #f5f5f5" }}>
                                            <Typography sx={{ fontSize: 12 }}>{ing.name}</Typography>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                                                <Box onClick={() => adjustIngredient(ing.id, -1)}
                                                    sx={{ width: 24, height: 24, border: "1.5px solid #ddd", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 14, color: "#555", userSelect: "none", "&:hover": { bgcolor: "#f5f5f5" } }}>
                                                    −
                                                </Box>
                                                <Typography sx={{ fontSize: 12, fontWeight: 600, minWidth: 16, textAlign: "center" }}>{qty}</Typography>
                                                <Box onClick={() => adjustIngredient(ing.id, 1)}
                                                    sx={{ width: 24, height: 24, border: "1.5px solid #ddd", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 14, color: "#555", userSelect: "none", "&:hover": { bgcolor: "#f5f5f5" } }}>
                                                    +
                                                </Box>
                                            </Box>
                                        </Box>
                                    );
                                })}
                            </Box>
                        )}

                        {/* Variants */}
                        {isChicken && variantGroups.map((group) => (
                            <Box key={group.id} sx={{ border: "1px solid #eee", borderRadius: 2, p: 1.5, mb: 2 }}>
                                <Typography sx={{ fontSize: 12, fontWeight: 700, mb: 1.5, color: "#555" }}>{group.name}</Typography>
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                    {(group.variantItems ?? []).map((vi) => (
                                        <FormControlLabel key={vi.id}
                                            control={
                                                <Checkbox
                                                    checked={(selectedVariants[group.id] ?? []).includes(vi.id)}
                                                    onChange={() => toggleVariant(group.id, vi.id)}
                                                    size="small"
                                                    sx={{ color: "#ddd", "&.Mui-checked": { color: "#222" } }}
                                                />
                                            }
                                            label={<Typography sx={{ fontSize: 11 }}>{vi.name}</Typography>}
                                        />
                                    ))}
                                </Box>
                            </Box>
                        ))}

                        {/* Permintaan Khusus */}
                        {(isBurger || isChicken) && (
                            <Box sx={{ border: "1px solid #eee", borderRadius: 2, p: 1.5, mb: 2 }}>
                                <Typography sx={{ fontSize: 12, fontWeight: 700, mb: 1, color: "#555" }}>Permintaan Khusus</Typography>
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                    {["Plain"].map((req) => (
                                        <FormControlLabel key={req}
                                            control={
                                                <Checkbox
                                                    checked={specialRequests.includes(req)}
                                                    onChange={() => toggleSpecial(req)}
                                                    size="small"
                                                    sx={{ color: "#ddd", "&.Mui-checked": { color: "#222" } }}
                                                />
                                            }
                                            label={<Typography sx={{ fontSize: 11 }}>{req}</Typography>}
                                        />
                                    ))}
                                </Box>
                            </Box>
                        )}
                    </Box>

                    {/* Bottom buttons */}
                    <Box sx={{ px: 2, pb: 2.5, pt: 1.5, display: "flex", gap: 1.5 }}>
                        <Button fullWidth variant="outlined" onClick={() => setShowModifikasi(false)}
                            sx={{ borderRadius: 2, textTransform: "none", fontSize: 12, color: "#555", borderColor: "#ddd", py: 1 }}>
                            Batalkan Perubahan
                        </Button>
                        <Button fullWidth variant="contained" onClick={() => setShowModifikasi(false)}
                            sx={{ borderRadius: 2, textTransform: "none", fontSize: 12, fontWeight: 700, bgcolor: "#FFC72C", color: "#000", py: 1, "&:hover": { bgcolor: "#ffb300" } }}>
                            Simpan Perubahan
                        </Button>
                    </Box>
                </Box>
            )}
        </>,
        document.body
    );
};

export default ItemCustomization;