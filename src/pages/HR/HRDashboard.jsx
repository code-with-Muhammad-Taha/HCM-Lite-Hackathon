import { useEffect, useState } from "react";
import { Grid, Typography, Paper, Container } from "@mui/material";
import StatCard from "../../components/StatCard";
import { getEmployees } from "../../services/authService";
import { getAllLeaves } from "../../services/leaveService";

const HRDashboard = () => {
  const [stats, setStats] = useState({ employees: 0, pendingLeaves: 0 });
  useEffect(() => {
    (async () => {
      const [emps, leaves] = await Promise.all([getEmployees(), getAllLeaves()]);
      setStats({ employees: emps.length, pendingLeaves: leaves.filter((l) => l.status === "pending").length });
    })();
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h4" fontWeight={700} mb={3}>HR Dashboard</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}><StatCard title="Total Employees" value={stats.employees} color="#3b82f6" /></Grid>
        <Grid item xs={12} sm={6}><StatCard title="Pending Leave Requests" value={stats.pendingLeaves} color="#f59e0b" /></Grid>
      </Grid>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" fontWeight={600}>Quick Guide</Typography>
        <Typography color="text.secondary" mt={1}>Register employees, manage attendance, approve leaves, and draft payroll from the sidebar.</Typography>
      </Paper>
    </Container>
  );
};

export default HRDashboard;