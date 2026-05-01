import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Box, Grid, Card, CardContent,
  Typography, Skeleton, Button,
} from "@mui/material";
import { getImageUrl } from "../services/api";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface FilterMenu {
  id: string;
  name: string;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  isNew: boolean;
  isAvailable: boolean;
  isPackage: boolean;
  imageUrl: string;
  filterMenu: FilterMenu;
}

interface Section {
  id: string;
  name: string;
  filterMenus: FilterMenu[];
}

const MenuCategory = () => {
  const { sectionId } = useParams<{ sectionId: string }>();
  const navigate = useNavigate();

  const [section, setSection] = useState<Section | null>(null);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [activeFilterId, setActiveFilterId] = useState<string | null>(null);
  const [loadingSection, setLoadingSection] = useState(true);
  const [loadingItems, setLoadingItems] = useState(true);

  useEffect(() => {
    if (!sectionId) return;
    setLoadingSection(true);
    setActiveFilterId(null);
    setItems([]);

    fetch(`${BASE_URL}/menusection/${sectionId}`)
      .then((res) => res.json())
      .then((data) => setSection(data.data))
      .catch(console.error)
      .finally(() => setLoadingSection(false));
  }, [sectionId]);

  useEffect(() => {
    if (!section) return;
    setLoadingItems(true);

    const filterIds = activeFilterId
      ? [activeFilterId]
      : section.filterMenus.map((f) => f.id);

    if (filterIds.length === 0) {
      setItems([]);
      setLoadingItems(false);
      return;
    }

    Promise.all(
      filterIds.map((id) =>
        fetch(`${BASE_URL}/menu?filterMenuId=${id}`)
          .then((res) => res.json())
          .then((data) => (data.data ?? []) as MenuItem[])
      )
    )
      .then((results) => {
        const merged = results.flat();
        const unique = Array.from(
          new Map(merged.map((m) => [m.id, m])).values()
        );
        setItems(unique);
      })
      .catch(console.error)
      .finally(() => setLoadingItems(false));
  }, [section, activeFilterId]);

  const formatPrice = (price: number) =>
    `Rp${price.toLocaleString("id-ID")}`;

  const hasFilters = (section?.filterMenus?.length ?? 0) > 1;

  return (
    <Box>
      {/* Header */}
      {loadingSection ? (
        <Skeleton width={220} height={44} sx={{ mb: 0.5 }} />
      ) : (
        <Typography
          sx={{ fontSize: 28, fontWeight: 700, mb: 0.5, color: "#222" }} // ← bold
        >
          {section?.name}
        </Typography>
      )}

      {/* Sub-filter pills — dengan scroll horizontal */}
      {!loadingSection && hasFilters && (
        <Box mb={2.5}>
          <Typography variant="body2" color="text.secondary" mb={1.5}>
            Gunakan filter berikut untuk memudahkan pencarian
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap",        // ← wrap kalau kebanyak
              maxHeight: 80,           // ← max 2 baris
              overflowY: "auto",       // ← scroll vertikal kalau lebih
              pr: 1,
              // styling scrollbar biar keliatan tipis kayak MCD
              "&::-webkit-scrollbar": { width: 4 },
              "&::-webkit-scrollbar-track": { bgcolor: "transparent" },
              "&::-webkit-scrollbar-thumb": {
                bgcolor: "#ccc",
                borderRadius: 999,
              },
            }}
          >
            <Button
              onClick={() => setActiveFilterId(null)}
              variant={activeFilterId === null ? "contained" : "outlined"}
              sx={{
                borderRadius: 999,
                textTransform: "none",
                fontWeight: 600,
                fontSize: 14,
                px: 2.5,
                py: 0.7,
                bgcolor: activeFilterId === null ? "#222" : "white",
                color: activeFilterId === null ? "white" : "#222",
                borderColor: "#bbb",
                boxShadow: "none",
                flexShrink: 0,
                "&:hover": {
                  bgcolor: activeFilterId === null ? "#333" : "#f5f5f5",
                  boxShadow: "none",
                },
              }}
            >
              Semua
            </Button>

            {section?.filterMenus.map((f) => (
              <Button
                key={f.id}
                onClick={() => setActiveFilterId(f.id)}
                variant={activeFilterId === f.id ? "contained" : "outlined"}
                sx={{
                  borderRadius: 999,
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: 14,
                  px: 2.5,
                  py: 0.7,
                  bgcolor: activeFilterId === f.id ? "#222" : "white",
                  color: activeFilterId === f.id ? "white" : "#222",
                  borderColor: "#bbb",
                  boxShadow: "none",
                  flexShrink: 0,
                  "&:hover": {
                    bgcolor: activeFilterId === f.id ? "#333" : "#f5f5f5",
                    boxShadow: "none",
                  },
                }}
              >
                {f.name}
              </Button>
            ))}
          </Box>
        </Box>
      )}


      {/* Grid */}
      <Grid container spacing={1.5} sx={{ mt: 2}}>
        {loadingItems
          ? Array.from({ length: 6 }).map((_, i) => (
            <Grid item xs={4} key={i}>
              <Skeleton
                variant="rectangular"
                height={260}
                sx={{ borderRadius: 2 }}
              />
            </Grid>
          ))
          : items.map((item) => (
            <Grid item xs={4} key={item.id}>
              <Card
                onClick={() => {
                  if (!item.isAvailable) return;
                  navigate(`/employee/category/${sectionId}/item/${item.id}`);
                }}
                sx={{
                  borderRadius: 2,
                  border: "1px solid #eee",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                  opacity: item.isAvailable ? 1 : 0.5,
                  cursor: item.isAvailable ? "pointer" : "default",
                  transition: "box-shadow 0.15s",
                  overflow: "hidden",
                  "&:hover": item.isAvailable
                    ? { boxShadow: "0 4px 16px rgba(0,0,0,0.13)" }
                    : {},
                }}
              >
                {/* Image area */}
                <Box
                  sx={{
                    position: "relative",
                    bgcolor: "white",
                    height: 170,
                    overflow: "hidden",
                  }}
                >
                  <Box
                    component="img"
                    src={getImageUrl(item.imageUrl) || "/placeholder.png"}
                    alt={item.name}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />

                  {/* Badge Baru! — pakai Box bukan Chip */}
                  {item.isNew && item.isAvailable && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 8,
                        left: 8,
                        bgcolor: "#FFC72C",
                        color: "#000",
                        fontWeight: 700,
                        fontSize: 11,
                        px: 1,
                        py: 0.3,
                        borderRadius: 1,
                        lineHeight: 1.4,
                        zIndex: 1,
                      }}
                    >
                      Baru!
                    </Box>
                  )}

                  {/* Badge Habis */}
                  {!item.isAvailable && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 8,
                        left: 8,
                        bgcolor: "#888",
                        color: "white",
                        fontWeight: 700,
                        fontSize: 11,
                        px: 1,
                        py: 0.3,
                        borderRadius: 1,
                        lineHeight: 1.4,
                        zIndex: 1,
                      }}
                    >
                      Habis
                    </Box>
                  )}
                </Box>

                {/* Info */}
                <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 700,  // ← bold
                      lineHeight: 1.3,
                      mb: 0.3,          // ← lebih nempel ke harga
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textDecoration: item.isAvailable ? "none" : "line-through",
                      color: item.isAvailable ? "#111" : "#aaa",
                      minHeight: 34,
                    }}
                  >
                    {item.name}
                  </Typography>
                  <Typography
                    sx={{ fontSize: 13, color: "#444", fontWeight: 400 }}
                  >
                    {formatPrice(item.price)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}

        {!loadingItems && items.length === 0 && (
          <Grid item xs={12}>
            <Typography
              color="text.secondary"
              textAlign="center"
              mt={8}
              fontSize={15}
            >
              Tidak ada menu di kategori ini.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default MenuCategory;