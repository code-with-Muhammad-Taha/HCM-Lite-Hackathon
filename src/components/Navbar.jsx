import { AppBar, Toolbar, Typography, IconButton, Avatar, Menu, MenuItem, Badge } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ onMenuClick }) => {
  const { userData, logout } = useAuth();
  const [anchor, setAnchor] = useState(null);
  const navigate = useNavigate();

  return (
    <AppBar position="fixed" sx={{ background: "#1e293b", zIndex: (t) => t.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton color="inherit" onClick={onMenuClick} edge="start"><MenuIcon /></IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1, ml: 2, fontWeight: 600 }}>
          {userData?.role?.toUpperCase()} Panel
        </Typography>
        <IconButton color="inherit"><Badge badgeContent={2} color="error"><NotificationsIcon /></Badge></IconButton>
        <IconButton onClick={(e) => setAnchor(e.currentTarget)} sx={{ ml: 1 }}>
          <Avatar sx={{ bgcolor: "#3b82f6" }}>{userData?.name?.[0]?.toUpperCase()}</Avatar>
        </IconButton>
        <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
          <MenuItem disabled>{userData?.email}</MenuItem>
          <MenuItem onClick={() => { logout(); navigate("/login"); }}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;