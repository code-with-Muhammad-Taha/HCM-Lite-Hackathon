import { useState } from "react";
import { Box, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const DRAWER_WIDTH = 260;

const Layout = () => {
  const [open, setOpen] = useState(true);
  return (
    <Box sx={{ display: "flex" }}>
      <Navbar onMenuClick={() => setOpen(!open)} />
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: open ? `${DRAWER_WIDTH}px` : 0, transition: "margin 0.3s", background: "#f8fafc", minHeight: "100vh" }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;