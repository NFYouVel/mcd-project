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
import { useNavigate } from "react-router";
import ad from "../assets/ad.webp";

const BigMac = "http://localhost:5000/uploads/menu/bigmac.webp";
const Chicken = "http://localhost:5000/uploads/menu/ayam_krispy.webp";
const IceCream = "http://localhost:5000/uploads/menu/mcflurry_oreo.webp";
const Spaghetti = "http://localhost:5000/uploads/menu/mcspaghetti.png";

// ── Types ─────────────────────────────────────────────
interface MenuSection {
  id: string;
  name: string;
}

interface Menu {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  isAvailable: boolean;
  isNew: boolean;
  filterMenu: {
    id: string;
    name: string;
    menuSections?: MenuSection[];
  };
}

// ── Image mapper ──────────────────────────────────────
const sectionImageMap: Record<string, string> = {
  Burger: BigMac,
  "Ayam McD Krispy": Chicken,
  "Menu Receh": IceCream,
  "Menu Hebat": Spaghetti,
};

// ── Section Card ──────────────────────────────────────
function SectionCard({ section }: { section: MenuSection }) {
  const image = sectionImageMap[section.name] || Spaghetti;

  return (
    <Box sx={{ flex: 1 }}>
      <Card sx={{ height: "100%", minHeight: 200 }}>
        <CardActionArea
          component={Link}
          to={`/employee/category/${section.id}`}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            height: 200,
            overflow: "hidden",
          }}
        >
          <CardContent sx={{ flex: 1, display: "flex", alignItems: "center" }}>
            <Typography variant="h5">{section.name}</Typography>
          </CardContent>

          <Box
            component="img"
            src={image}
            alt={section.name}
            sx={{
              width: "60%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "left",
              flexShrink: 0,
            }}
          />
        </CardActionArea>
      </Card>
    </Box>
  );
}

// ── Recommendation Card ───────────────────────────────
function RecommendationCard({ menu }: { menu: Menu }) {
  const navigate = useNavigate();

  const sectionId = menu.filterMenu?.menuSections?.[0]?.id;

  const imageSrc = menu.imageUrl ? menu.imageUrl : Spaghetti;

  return (
    <Box sx={{ flex: 1 }}>
      <Card sx={{ height: "100%", minHeight: 200 }}>
        <CardActionArea
          onClick={() => {
            if (!menu.isAvailable || !sectionId) return;
            navigate(`/employee/category/${sectionId}/item/${menu.id}`);
          }}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            height: 200,
            overflow: "hidden",
            cursor: menu.isAvailable ? "pointer" : "default",
            opacity: menu.isAvailable ? 1 : 0.5,
          }}
        >
          {/* LEFT SIDE TEXT */}
          <CardContent sx={{ flex: 1, display: "flex", alignItems: "center" }}>
            <Box>
              <Typography variant="h5">{menu.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                Rp{menu.price.toLocaleString("id-ID")}
              </Typography>
            </Box>
          </CardContent>

          {/* RIGHT SIDE IMAGE (THIS WAS MISSING) */}
          <Box
            component="img"
            src={imageSrc}
            alt={menu.name}
            sx={{
              width: "60%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "left",
              flexShrink: 0,
            }}
          />
        </CardActionArea>
      </Card>
    </Box>
  );
}

// ── Skeleton ─────────────────────────────────────────
function RecommendationSkeleton() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, i) => (
        <Box key={i} sx={{ flex: 1 }}>
          <Skeleton variant="rounded" height={200} />
        </Box>
      ))}
    </>
  );
}

// ── MAIN ──────────────────────────────────────────────
const MainMenuEmployee = () => {
  const [sections, setSections] = useState<MenuSection[]>([]);
  const [recommendations, setRecommendations] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const paketHebatSection = sections.find(
    (s) => s.name.toLowerCase() === "paket hebat"
  );

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);

        const [secRes, menuRes] = await Promise.all([
          fetch("/api/menusection"), // ⚠️ make sure backend matches this
          fetch("/api/menu?isAvailable=true&limit=3&page=1"),
        ]);

        const secJson = await secRes.json();
        const menuJson = await menuRes.json();

        setSections(secJson.data || []);
        setRecommendations(menuJson.data || []);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  return (
    <>
      <h1>Pesan Sekarang</h1>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* ── TOP 3 SECTIONS ── */}
        <Box sx={{ display: "flex", gap: 2 }}>
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} variant="rounded" height={200} sx={{ flex: 1 }} />
            ))
            : sections.slice(0, 3).map((section) => (
              <SectionCard key={section.id} section={section} />
            ))}
        </Box>

        {/* ── AD ── */}
        {paketHebatSection && (
          <Box
            component={Link}
            to={`/employee/category/${paketHebatSection.id}`}
          >
            <Box
              component="img"
              src={ad}
              alt="ad"
              sx={{
                width: "100%",
                borderRadius: 4,
                cursor: "pointer",
              }}
            />
          </Box>
        )}

        {/* ── REKOMENDASI ── */}
        <h1>Rekomendasi</h1>

        {error && <Alert severity="error">{error}</Alert>}

        <Box sx={{ display: "flex", gap: 2 }}>
          {loading ? (
            <RecommendationSkeleton />
          ) : recommendations.length ? (
            recommendations.slice(0, 3).map((menu) => (
              <RecommendationCard key={menu.id} menu={menu} />
            ))
          ) : (
            <Typography>Tidak ada rekomendasi tersedia.</Typography>
          )}
        </Box>
      </Box>
    </>
  );
};

export default MainMenuEmployee;