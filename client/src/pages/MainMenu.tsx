import { Card, CardActionArea, CardContent, Typography, Box } from "@mui/material";
import { Link } from "react-router";
import ad from "../assets/ad.webp";
import BigMac from "../assets/BigMac.webp";
import Chicken from "../assets/chicken.webp";
import IceCream from "../assets/icecream.png";
import Spaghetti from "../assets/spaghetti.png";

const MainMenu = () => {
  const menus = [
    { title: "Burger", path: "/products/burger", image: BigMac },
    { title: "Ayam McD", path: "/products/chicken", image: Chicken },
    { title: "Menu Receh", path: "/products/value", image: IceCream },
    { title: "Menu Hebat", path: "/products/cheap", image: Spaghetti},
  ];

  return (
    <>
      <h1>Pesan Sekarang</h1>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box sx={{ display: "flex", gap: 2 }}>
          {menus.map((menu) => (
            <Box key={menu.title} sx={{ flex: 1 }}>
              <Card sx={{ height: "100%", minHeight: 200 }}>
                <CardActionArea
                  component={Link}
                  to={menu.path}
                  sx={{ display: "flex", justifyContent: "space-between", height: 200, overflow: "hidden" }}
                >
                  <CardContent sx={{ flex: 1, display: "flex", alignItems: "center" }}>
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 1 }}>
                  <Typography variant="h5">{menu.title}</Typography>
                </Box>
                </CardContent>
                  <Box
                    component="img"
                    src={menu.image}
                    alt={menu.title}
                    sx={{ width: "60%", height: "100%", objectFit: "cover", objectPosition: "left", flexShrink: 0 }}
                  />
                </CardActionArea>
              </Card>
            </Box>
          ))}
        </Box>
        <Box
          component="img"
          src={ad}
          alt="ad"
          sx={{ width: "100%", height: "100%", objectFit: "fill", borderRadius: 4 }}
        />
        <h1>Rekomendasi</h1>
        <Box sx={{ display: "flex", gap: 2 }}>
          {menus.map((menu) => (
            <Box key={menu.title} sx={{ flex: 1 }}>
              <Card sx={{ height: "100%", minHeight: 200 }}>
                <CardActionArea
                  component={Link}
                  to={menu.path}
                  sx={{ display: "flex", justifyContent: "space-between", height: 200, overflow: "hidden" }}
                >
                  <CardContent sx={{ flex: 1, display: "flex", alignItems: "center" }}>
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 1 }}>
                  <Typography variant="h5">{menu.title}</Typography>
                </Box>
                </CardContent>
                  <Box
                    component="img"
                    src={menu.image}
                    alt={menu.title}
                    sx={{ width: "60%", height: "100%", objectFit: "cover", objectPosition: "left", flexShrink: 0 }}
                  />
                </CardActionArea>
              </Card>
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
};

export default MainMenu;