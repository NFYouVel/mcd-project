import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router";

type Menu = {
    id: string;
    name: string;
    imageUrl: string | null;
};

export default function EmployeeMenu() {
    const [menus, setMenus] = useState<Menu[]>([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchMenus = async () => {
            try {
                const res = await fetch("/api/menu");
                const data = await res.json();

                setMenus(data.data); // 👈 THIS is what you're missing
                console.log(data);
            } catch (err) {
                console.error("Failed to fetch menus:", err);
            }
        };

        fetchMenus();
    }, []);

    const handleClick = (menu: Menu) => {
        if (!menu.isPackage) {
            navigate(`/employee/${menu.id}/make-package`);
            return;
        }

        navigate(`/employee/menu/${menu.id}`);
    };

    return (
        <>
            <h1>Rekomendasi</h1>
            <Box sx={{ p: 2 }}>

                {/* GRID */}
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)", // 👈 3 per row
                        gap: 2,
                    }}
                >
                    {menus.map((menu) => (
                        <Box
                            onClick={() => handleClick(menu)}
                            sx={{
                                border: "1px solid #ddd",
                                borderRadius: 2,
                                overflow: "hidden",
                                cursor: "pointer",
                                transition: "0.2s",
                                "&:hover": {
                                    transform: "scale(1.03)",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                },
                            }}
                        >
                            {/* IMAGE */}
                            <Box
                                sx={{
                                    height: 120,
                                    backgroundColor: "#f5f5f5",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                {menu.imageUrl ? (
                                    <img
                                        src={`http://localhost:5000${menu.imageUrl}`}
                                        alt={menu.name}
                                        style={{
                                            maxHeight: "100%",
                                            maxWidth: "100%",
                                            objectFit: "contain",
                                        }}
                                    />
                                ) : (
                                    <Typography variant="caption">No Image</Typography>
                                )}
                            </Box>

                            {/* NAME */}
                            <Box sx={{ p: 1 }}>
                                <Typography fontWeight="bold" fontSize={14}>
                                    {menu.name}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>
        </>
    );
}