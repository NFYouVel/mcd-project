import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Box, Typography, Skeleton, Button } from "@mui/material";
import { createPortal } from "react-dom";
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

    const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };

    Promise.all([
      fetch(`${BASE_URL}/menu/${itemId}`, { headers })
        .then((r) => r.json())
        .then((d) => d.data as MenuItem),

      fetch(`${BASE_URL}/menu?isPackage=true`, { headers })
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

 const handleChoose = (chosenId: string) => {
  navigate(`/employee/category/${sectionId}/customize/${chosenId}`);
};
  const formatPrice = (price: number) =>
    `Rp${price?.toLocaleString("id-ID") ?? 0}`;

  return createPortal(
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        bgcolor: "rgba(255,255,255,0.75)",
        backdropFilter: "blur(8px)",
        display: "flex",
        flexDirection: "column",
        px: 5,
        py: 4,
      }}
    >
      {/* Label atas — tetap di kiri atas */}
      <Typography sx={{ fontSize: 13, color: "#555", fontWeight: 600 }}>
        1pc {item?.name ?? ""}
      </Typography>

      {/* Semua konten tengah */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 3,
        }}
      >
        {/* Pertanyaan */}
        <Typography
          sx={{
            fontSize: 28,
            fontWeight: 700,
            color: "#111",
            lineHeight: 1.2,
            textAlign: "left",
            maxWidth: 360,
          }}
        >
          {pkg ? "Mau tambah kentang atau minuman?" : "Tambahkan ke pesanan?"}
        </Typography>

        {/* Kartu */}
        {loading ? (
          <Box display="flex" gap={2}>
            <Skeleton variant="rectangular" width={180} height={200} sx={{ borderRadius: 2 }} />
            <Skeleton variant="rectangular" width={180} height={200} sx={{ borderRadius: 2 }} />
          </Box>
        ) : (
          <Box sx={{ display: "flex", gap: 2 }}>
            {/* PAKET */}
            {pkg && (
              <Box
                onClick={() => handleChoose(pkg.id)}
                sx={{
                  border: "1.5px solid #ddd",
                  borderRadius: 2,
                  overflow: "hidden",
                  bgcolor: "white",
                  cursor: "pointer",
                  width: 180,
                  transition: "box-shadow 0.15s",
                  "&:hover": { boxShadow: "0 4px 16px rgba(0,0,0,0.13)" },
                }}
              >
                <Box
                  component="img"
                  src={getImageUrl(pkg.imageUrl) || "/placeholder.png"}
                  alt={pkg.name}
                  sx={{
                    width: "100%",
                    height: 120,
                    objectFit: "cover",
                    bgcolor: "white",
                    display: "block",
                  }}
                />
                <Box sx={{ p: 1.5 }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
                    Iya, jadikan paket
                  </Typography>
                </Box>
              </Box>
            )}

            {/* SATUAN */}
            <Box
              onClick={() => item && handleChoose(item.id)}
              sx={{
                border: "1.5px solid #ddd",
                borderRadius: 2,
                overflow: "hidden",
                bgcolor: "white",
                cursor: "pointer",
                width: 180,
                transition: "box-shadow 0.15s",
                "&:hover": { boxShadow: "0 4px 16px rgba(0,0,0,0.13)" },
              }}
            >
              <Box
                component="img"
                src={getImageUrl(item?.imageUrl) || "/placeholder.png"}
                alt={item?.name}
                sx={{
                  width: "100%",
                  height: 120,
                  objectFit: "cover",
                  bgcolor: "white",
                  display: "block",
                }}
              />
              <Box sx={{ p: 1.5 }}>
                <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
                  Tidak, satuan saja
                </Typography>
                <Typography sx={{ fontSize: 12, color: "#555", mt: 0.3 }}>
                  {formatPrice(item?.price ?? 0)}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        {/* Batal */}
        <Button
          onClick={() => navigate(`/employee/category/${sectionId}`)}
          variant="outlined"
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontSize: 14,
            color: "#555",
            borderColor: "#ddd",
            py: 1.2,
            px: 6,
            "&:hover": { bgcolor: "#f5f5f5", borderColor: "#ccc" },
          }}
        >
          Batal
        </Button>
      </Box>
    </Box>,
    document.body
  );
};

export default ItemPackageChoice;