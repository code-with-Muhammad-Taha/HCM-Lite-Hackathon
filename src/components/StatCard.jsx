import { Paper, Box, Typography, Avatar } from "@mui/material";

const StatCard = ({ title, value, icon, color = "#3b82f6" }) => (
  <Paper sx={{ p: 3, display: "flex", alignItems: "center", gap: 2, borderRadius: 3 }}>
    <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>{icon}</Avatar>
    <Box>
      <Typography variant="body2" color="text.secondary">{title}</Typography>
      <Typography variant="h5" fontWeight={700}>{value}</Typography>
    </Box>
  </Paper>
);

export default StatCard;