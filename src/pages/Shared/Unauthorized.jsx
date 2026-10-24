import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}>
      <Typography variant="h1" fontWeight={700} color="error">403</Typography>
      <Typography variant="h5">Unauthorized Access</Typography>
      <Typography color="text.secondary">Aap is page ka access nahi rakhte</Typography>
      <Button variant="contained" onClick={() => navigate("/login")}>Go to Login</Button>
    </Box>
  );
};

export default Unauthorized;