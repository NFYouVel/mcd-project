import { useParams, useNavigate } from "react-router";
import { Box, Typography, Button } from "@mui/material";

export default function MakePackagePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleContinue = () => {
    // go package flow
    navigate(`/employee/${id}/order-modification`);
  };

  const handleAlaCarte = () => {
    // 👇 THIS is your ala carte flow
    navigate(`/employee/${id}/order-modification`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5">
        Jadikan Paket?
      </Typography>

      <Typography sx={{ mt: 2 }}>
        Menu ini bisa dijadikan paket atau langsung ala carte.
      </Typography>

      <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
        {/* ALA CARTE */}
        <Button variant="outlined" onClick={handleAlaCarte}>
          No Thanks (Ala Carte)
        </Button>

        {/* PACKAGE */}
        <Button variant="contained" onClick={handleContinue}>
          Continue (Make Package)
        </Button>
      </Box>
    </Box>
  );
}