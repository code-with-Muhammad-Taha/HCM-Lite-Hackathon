import { useEffect, useState } from "react";
import { Grid, Typography, Paper, Container } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import PaymentsIcon from "@mui/icons-material/Payments";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { getEmployees } from "../../services/authService";
import { getPayroll } from "../../services/payrollService";
import { getAllLeaves } from "../../services/leaveService";
import { getAllAttendance } from "../../services/attendanceService";
import StatCard from "../../components/StatCard";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ employees: 0, payroll: 0, leaves: 0, attendance: 0 });
  useEffect(() => {
    (async () => {
      const [emps, pay, leaves, att] = await Promise.all([getEmployees(), getPayroll(), getAllLeaves(), getAllAttendance()]);
      setStats({
        employees: emps.length,
        payroll: pay.reduce((s, p) => s + (p.net || 0), 0),
        leaves: leaves.filter((l) => l.status === "pending").length,
        attendance: att.length,
      });
    })();
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h4" fontWeight={700} mb={3}>Admin Dashboard</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Total Employees" value={stats.employees} icon={<PeopleIcon />} color="#3b82f6" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Payroll Cost" value={`₨ ${stats.payroll.toLocaleString()}`} icon={<PaymentsIcon />} color="#10b981" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Pending Leaves" value={stats.leaves} icon={<EventBusyIcon />} color="#f59e0b" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Attendance Records" value={stats.attendance} icon={<AccessTimeIcon />} color="#8b5cf6" /></Grid>
      </Grid>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" fontWeight={600} mb={2}>Welcome, Admin 👋</Typography>
        <Typography color="text.secondary">Manage company setup, departments, leave types, holidays, users, and payroll from the sidebar.</Typography>
      </Paper>
    </Container>
  );
};

export default AdminDashboard;