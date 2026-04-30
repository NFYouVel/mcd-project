import { useEffect, useState } from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
  Skeleton,
  Alert,
} from "@mui/material";
import { Link } from "react-router";
import ad from "../assets/ad.webp";
import BigMac from "../assets/BigMac.webp";
import Chicken from "../assets/chicken.webp";
import IceCream from "../assets/icecream.png";
import Spaghetti from "../assets/spaghetti.png";

// ── Types ──────────────────────────────────────────────────────────────────────
interface Menu {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  isAvailable: boolean;
  isNew: boolean;
}

// ── Static menu cards (top section) ───────────────────────────────────────────
const STATIC_MENUS = [
  { title: "Burger",     path: "/products/burger",  image: BigMac    },
  { title: "Ayam McD",  path: "/products/chicken", image: Chicken   },
  { title: "Menu Receh",path: "/products/value",   image: IceCream  },
  { title: "Menu Hebat",path: "/products/cheap",   image: Spaghetti },
];

// ── Reusable static card ───────────────────────────────────────────────────────
function StaticMenuCard({ title, path, image }: { title: string; path: string; image: string }) {
  return (
    <Box sx={{ flex: 1 }}>
      <Card sx={{ height: "100%", minHeight: 200 }}>
        <CardActionArea
          component={Link}
          to={path}
          sx={{ display: "flex", justifyContent: "space-between", height: 200, overflow: "hidden" }}
        >
          <CardContent sx={{ flex: 1, display: "flex", alignItems: "center" }}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 1 }}>
              <Typography variant="h5">{title}</Typography>
            </Box>
          </CardContent>
          <Box
            component="img"
            src={image}
            alt={title}
            sx={{ width: "60%", height: "100%", objectFit: "cover", objectPosition: "left", flexShrink: 0 }}
          />
        </CardActionArea>
      </Card>
    </Box>
  );
}

// ── Dynamic recommendation card ────────────────────────────────────────────────
function RecommendationCard({ menu }: { menu: Menu }) {
    const imageSrc = menu.imageUrl ? menu.imageUrl : Spaghetti;

  return (
    <Box sx={{ flex: 1 }}>
      <Card sx={{ height: "100%", minHeight: 200 }}>
        <CardActionArea
          component={Link}
          to={`/products/${menu.id}`}
          sx={{ display: "flex", justifyContent: "space-between", height: 200, overflow: "hidden" }}
        >
          <CardContent sx={{ flex: 1, display: "flex", alignItems: "center" }}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 1 }}>
              <Typography variant="h5">{menu.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                Rp{menu.price.toLocaleString("id-ID")}
              </Typography>
              {menu.isNew && (
                <Typography
                  variant="caption"
                  sx={{
                    background: "linear-gradient(135deg,#FFC72C,#FFD700)",
                    color: "#333",
                    px: 1,
                    py: 0.25,
                    borderRadius: 1,
                    fontWeight: 700,
                  }}
                >
                  Baru!
                </Typography>
              )}
            </Box>
          </CardContent>
          <Box
            component="img"
            src={imageSrc}
            alt={menu.name}
            sx={{ width: "60%", height: "100%", objectFit: "cover", objectPosition: "left", flexShrink: 0 }}
          />
        </CardActionArea>
      </Card>
    </Box>
  );
}

// ── Skeleton loader ────────────────────────────────────────────────────────────
function RecommendationSkeleton() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <Box key={i} sx={{ flex: 1 }}>
          <Skeleton variant="rounded" height={200} />
        </Box>
      ))}
    </>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
const MainMenuEmployee = () => {
  const [recommendations, setRecommendations] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch available menus, newest first (limit 4 to match the layout)
        const params = new URLSearchParams({
          isAvailable: "true",
          limit: "4",
          page: "1",
        });

        const res = await fetch(`/api/menu?${params.toString()}`);

        if (!res.ok) throw new Error(`Server error: ${res.status}`);

        const json = await res.json();

        if (!json.success) throw new Error(json.message ?? "Failed to fetch menus");

        setRecommendations(json.data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  return (
    <>
      <h1>Pesan Sekarang</h1>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

        {/* ── Static category cards ── */}
        <Box sx={{ display: "flex", gap: 2 }}>
          {STATIC_MENUS.map((menu) => (
            <StaticMenuCard key={menu.title} {...menu} />
          ))}
        </Box>

        {/* ── Ad banner ── */}
        <Box
          component="img"
          src={ad}
          alt="ad"
          sx={{ width: "100%", height: "100%", objectFit: "fill", borderRadius: 4 }}
        />

        {/* ── Rekomendasi ── */}
        <h1>Rekomendasi</h1>

        {error && (
          <Alert severity="error" sx={{ mb: 1 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: "flex", gap: 2 }}>
          {loading ? (
            <RecommendationSkeleton />
          ) : recommendations.length > 0 ? (
            recommendations.map((menu) => (
              <RecommendationCard key={menu.id} menu={menu} />
            ))
          ) : (
            <Typography color="text.secondary">Tidak ada rekomendasi tersedia.</Typography>
          )}
        </Box>

      </Box>
    </>
  );
};

export default MainMenuEmployee;