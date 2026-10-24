import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Typography,
  Divider,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import PaymentsIcon from "@mui/icons-material/Payments";
import BusinessIcon from "@mui/icons-material/Business";
import SettingsIcon from "@mui/icons-material/Settings";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import CampaignIcon from "@mui/icons-material/Campaign";
import ReceiptIcon from "@mui/icons-material/Receipt";
import BadgeIcon from "@mui/icons-material/Badge";

import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const MENUS = {
  admin: [
    { label: "Dashboard", icon: <DashboardIcon />, path: "/admin" },
    { label: "Company Setup", icon: <BusinessIcon />, path: "/admin/company" },
    { label: "Departments", icon: <BusinessIcon />, path: "/admin/departments" },
    { label: "Leave Types", icon: <EventBusyIcon />, path: "/admin/leave-types" },
    { label: "Holidays", icon: <EventBusyIcon />, path: "/admin/holidays" },
    { label: "Users", icon: <PeopleIcon />, path: "/admin/users" },

    // New menu item: Create HR
    { label: "Create HR", icon: <PeopleIcon />, path: "/admin/create-hr" },

    { label: "Payroll Finalize", icon: <PaymentsIcon />, path: "/admin/payroll" },
    { label: "Audit Log", icon: <SettingsIcon />, path: "/admin/audit" },
    { label: "AI Assistant", icon: <SmartToyIcon />, path: "/admin/ai" },
  ],

  hr: [
    { label: "Dashboard", icon: <DashboardIcon />, path: "/hr" },
    { label: "Employees", icon: <PeopleIcon />, path: "/hr/employees" },
    { label: "Attendance", icon: <AccessTimeIcon />, path: "/hr/attendance" },
    { label: "Leave Approvals", icon: <EventBusyIcon />, path: "/hr/leave" },
    { label: "Payroll Draft", icon: <PaymentsIcon />, path: "/hr/payroll" },
    { label: "Announcements", icon: <CampaignIcon />, path: "/hr/announcements" },
    { label: "AI Assistant", icon: <SmartToyIcon />, path: "/hr/ai" },
  ],

  employee: [
    { label: "Dashboard", icon: <DashboardIcon />, path: "/employee" },
    { label: "My Attendance", icon: <AccessTimeIcon />, path: "/employee/attendance" },
    { label: "My Leave", icon: <EventBusyIcon />, path: "/employee/leave" },
    { label: "Payslips", icon: <ReceiptIcon />, path: "/employee/payslips" },
    { label: "My Profile", icon: <BadgeIcon />, path: "/employee/profile" },

    // New menu item: Announcements
    { label: "Announcements", icon: <CampaignIcon />, path: "/employee/announcements" },

    { label: "AI Assistant", icon: <SmartToyIcon />, path: "/employee/ai" },
  ],
};

const Sidebar = ({ open, onClose }) => {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const items = MENUS[userData?.role] || [];

  return (
    <Drawer
      variant="persistent"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: 260,
          boxSizing: "border-box",
          background: "#0f172a",
          color: "#fff",
        },
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{ color: "#60a5fa" }}
        >
          HCM Lite
        </Typography>
      </Toolbar>

      <Divider sx={{ bgcolor: "#1e293b" }} />

      <Box sx={{ p: 2 }}>
        <Typography
          variant="caption"
          sx={{
            color: "#64748b",
            textTransform: "uppercase",
          }}
        >
          {userData?.role} Panel
        </Typography>
      </Box>

      <List>
        {items.map((item) => (
          <ListItemButton
            key={item.path}
            onClick={() => {
              navigate(item.path);
              onClose();
            }}
            selected={location.pathname === item.path}
            sx={{
              mx: 1,
              borderRadius: 2,
              mb: 0.5,
              "&.Mui-selected": {
                background: "#1e40af",
              },
              "&:hover": {
                background: "#1e293b",
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: "#93c5fd",
                minWidth: 40,
              }}
            >
              {item.icon}
            </ListItemIcon>

            <ListItemText
              primary={item.label}
              sx={{ color: "#e2e8f0" }}
            />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;