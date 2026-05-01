import {
  Box, Button, Stack, Typography, Skeleton
} from "@mui/material";
import { Link, Outlet, useLocation } from "react-router";
import { Badge } from "@mui/material";
import { useEffect, useState } from "react";

import logo from "../assets/mcd logo.webp";
import paperbag from "../assets/mcd_paperbag.png";
import recs from "../assets/reccomendations.png";
import { getSectionsRequest } from "../services/api";

interface Section {
  id: string;
  name: string;
}

const EmployeeNavbar = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation(); // buat highlight active button

useEffect(() => {
  getSectionsRequest()
    .then((data) => setSections(data))
    .catch(console.error)
    .finally(() => setLoading(false));
}, []);

  return (
    <Box sx={{ display: "flex", m: 0, p: 0 }}>

      {/* Sidebar */}
      <Box
        sx={{
          width: 200,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          left: 0,
          top: 0,
          m: 0,
          p: 0,
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            height: 150,
            ml: 0, mr: 2, mt: 2,
            border: "1px solid #ddd",
            boxShadow: 2,
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            borderTopRightRadius: 4,
            borderBottomRightRadius: 4,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="logo"
            sx={{ height: "40%", objectFit: "contain" }}
          />
        </Box>

        {/* Awal Button */}
        <Button
          component={Link}
          to="/menu"
          sx={{
            ml: 0, mr: 2, mb: 4,
            justifyContent: "flex-start",
            border: "1px solid #ddd",
            boxShadow: 2,
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            borderTopRightRadius: 12,
            borderBottomRightRadius: 12,
            py: 1.5,
            textTransform: "none",
            display: "flex",
            alignItems: "center",
            gap: 1,
            bgcolor: location.pathname === "/menu" ? "#FFF8E1" : "white",
          }}
        >
          <Box
            component="img"
            src={recs}
            alt="recs"
            sx={{ width: 24, height: 24, objectFit: "contain" }}
          />
          <Typography sx={{ fontWeight: "bold", color: "black" }}>
            Awal
          </Typography>
        </Button>

        {/* Category Buttons */}
        <Stack spacing={0} sx={{ pl: 0, pr: 2, overflowY: "auto" }}>
          {loading
            ? // Skeleton sementara data belum datang
              Array.from({ length: 6 }).map((_, i) => (
                <Skeleton
                  key={i}
                  variant="rectangular"
                  height={52}
                  sx={{ mb: "1px", borderRadius: 0 }}
                />
              ))
            : sections.map((item, index) => {
                const isLast = index === sections.length - 1;
                const isActive =
                  location.pathname === `/menu/category/${item.id}`;

                return (
                  <Button
                    key={item.id}
                    component={Link}
                    to={`/employee/category/${item.id}`}
                    sx={{
                      justifyContent: "flex-start",
                      bgcolor: isActive ? "#FFF8E1" : "white",
                      color: "black",
                      fontWeight: isActive ? "bold" : "normal",
                      border: "1px solid #ddd",
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                      borderTop: index === 0 ? "1px solid #ddd" : "none",
                      borderTopRightRadius: index === 0 ? 12 : 0,
                      borderBottomRightRadius: isLast ? 12 : 0,
                      borderBottom: isLast ? "2px solid #ddd" : undefined,
                      boxShadow:
                        isLast ? "0px 6px 6px -2px rgba(0,0,0,0.2)" : "none",
                      py: 2,
                      textTransform: "none",
                    }}
                  >
                    {item.name}
                  </Button>
                );
              })}
        </Stack>
      </Box>

      {/* Right content */}
      <Box sx={{ flex: 1, p: 3, ml: "250px", pb: "180px" }}>
        <Outlet />
      </Box>

      {/* Bottom Bar */}
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 200,
          right: 0,
          height: 150,
          bgcolor: "white",
          borderTop: "1px solid #ddd",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
          boxShadow: "0px -2px 8px rgba(0,0,0,0.1)",
          zIndex: 1000,
        }}
      >
        {/* Left side */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Badge
            badgeContent={3}
            color="error"
            overlap="circular"
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            sx={{
              "& .MuiBadge-badge": {
                fontSize: "0.6rem",
                height: 16,
                minWidth: 16,
                top: 4,
                right: 4,
              },
            }}
          >
            <Box
              component="img"
              src={paperbag}
              alt="paperbag"
              sx={{ width: 40, height: 40 }}
            />
          </Badge>

          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Rp0
          </Typography>
        </Box>

        {/* Right side */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="outlined" sx={{ textTransform: "none" }}>
            Lihat Pesanan
          </Button>
          <Button
            variant="contained"
            sx={{
              bgcolor: "#FFC72C",
              color: "black",
              textTransform: "none",
              fontWeight: "bold",
              px: 3,
            }}
          >
            Bayar
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default EmployeeNavbar; 