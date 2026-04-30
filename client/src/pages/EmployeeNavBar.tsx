import { Link, Outlet, useLocation } from "react-router";
import { Box, Stack, Typography } from "@mui/material";
import logo from "../assets/mcd logo.webp";

const menuItems = [
  { label: "Awal", path: "/" },
  { label: "Promosi", path: "/promosi" },
  { label: "Burger", path: "/burger" },
  { label: "Ayam McD Spicy", path: "/ayam" },
  { label: "Paket Keluarga", path: "/keluarga" },
  { label: "Happy Meal", path: "/happymeal" },
  { label: "Paket Hebat", path: "/hemat" },
];

export default function EmployeeNavBar() {
  const location = useLocation();

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>

      {/* SIDEBAR */}
      <Box
        sx={{
          width: 250,
          py: 2,
          pr: 2,
          pl: 0, // 👈 remove left padding so border sticks to edge
          overflowY: "auto",
        }}
      >
        {/* LOGO */}
        <Box
          sx={{
            px: 2,
            py: 1.5,
            border: "1px solid #ddd",
            borderRadius: "0 8px 8px 0",
            mb: 2,
            height: 100, // 👈 YOU can change this freely later
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={logo}
            alt="logo"
            style={{
              height: "40px", // 👈 FIXED size (won’t change)
              width: "auto",
              objectFit: "contain",
            }}
          />
        </Box>

        {/* MENU WITH BORDER */}
        <Stack
          spacing={1}
          sx={{
            border: "1px solid #ddd",
            borderRadius: "0 12px 12px 0", // 👈 no rounding on left
            py: 1,
          }}
        >
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                style={{ textDecoration: "none" }}
              >
                <Box
                  sx={{
                    px: 2,
                    py: 1.5,
                    borderRadius: "0 8px 8px 0", // 👈 no left rounding
                    backgroundColor: isActive ? "#ffe082" : "transparent",
                    "&:hover": { backgroundColor: "#fff3cd" },
                  }}
                >
                  <Typography fontWeight={isActive ? "bold" : "normal"}>
                    {item.label}
                  </Typography>
                </Box>
              </Link>
            );
          })}
        </Stack>
      </Box>

      {/* MAIN CONTENT */}
      <Box sx={{ flex: 1, p: 3, overflowY: "auto" }}>
        <Outlet />
      </Box>

      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          height: 80,
          borderTop: "1px solid #ddd",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
          backgroundColor: "#fff",
          zIndex: 1000,
        }}
      >
        {/* LEFT: TOTAL */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              backgroundColor: "#ffc107",
              borderRadius: 2,
            }}
          />
          <Typography fontWeight="bold">Rp0</Typography>
        </Box>

        {/* RIGHT: BUTTON (moved here) */}
        <Box
          sx={{
            px: 4,
            py: 1.5,
            backgroundColor: "#ffe082",
            borderRadius: 2,
            cursor: "pointer",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          Lihat Pesanan
        </Box>
      </Box>
    </Box>


  );
}