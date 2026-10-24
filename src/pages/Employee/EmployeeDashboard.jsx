import { useEffect, useState } from "react";
import { Grid, Typography, Paper, Container, Button, Box, Chip } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { getTodayRecord, checkIn, checkOut } from "../../services/attendanceService";
import { getMyLeaves, getMyLeaveBalance } from "../../services/leaveService";
import { getMyPayroll } from "../../services/payrollService";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase/config";
import StatCard from "../../components/StatCard";
import { toast } from "react-toastify";

const EmployeeDashboard = () => {
  const { user, userData } = useAuth();
  const [today, setToday] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [payroll, setPayroll] = useState([]);
  const [balance, setBalance] = useState({});
  const [announcements, setAnnouncements] = useState([]);

  const load = async () => {
    const [rec, lv, pay, bal] = await Promise.all([
      getTodayRecord(user.uid),
      getMyLeaves(user.uid),
      getMyPayroll(user.uid),
      getMyLeaveBalance(user.uid),
    ]);
    setToday(rec); setLeaves(lv); setPayroll(pay); setBalance(bal);
    const annSnap = await getDocs(query(collection(db, "announcements"), orderBy("createdAt", "desc")));
    setAnnouncements(annSnap.docs.slice(0, 3).map((d) => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => { if (user) load(); }, [user]);

  const doIn = async () => { try { await checkIn(user.uid, userData.name); toast.success("Checked in!"); load(); } catch (e) { toast.error(e.message); } };
  const doOut = async () => { try { await checkOut(user.uid); toast.success("Checked out!"); load(); } catch (e) { toast.error(e.message); } };

  const lastPay = payroll[payroll.length - 1];

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h4" fontWeight={700} mb={1}>Hi, {userData?.name} 👋</Typography>
      <Typography color="text.secondary" mb={3}>Welcome to your dashboard</Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>Today's Attendance</Typography>
            {today ? (
              <Box>
                <Typography>Check-In: <b>{new Date(today.checkIn).toLocaleTimeString()}</b></Typography>
                <Typography>Check-Out: <b>{today.checkOut ? new Date(today.checkOut).toLocaleTimeString() : "—"}</b></Typography>
                <Chip label={today.status} color={today.status === "late" ? "warning" : "success"} sx={{ mt: 1 }} />
                {!today.checkOut && <Button variant="contained" color="error" sx={{ mt: 2, ml: 2 }} onClick={doOut}>Check Out</Button>}
              </Box>
            ) : (
              <Button variant="contained" color="success" onClick={doIn}>Check In</Button>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}><StatCard title="Last Payslip" value={lastPay ? `₨ ${lastPay.net?.toLocaleString()}` : "—"} color="#10b981" /></Grid>
        <Grid item xs={12} md={3}><StatCard title="Casual Leave Left" value={balance.casual?.left ?? "—"} color="#f59e0b" /></Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>Leave Balance</Typography>
            {Object.entries(balance).filter(([k]) => k !== "unpaid").map(([type, b]) => (
              <Box key={type} display="flex" justifyContent="space-between" mb={1}>
                <Typography textTransform="capitalize">{type}</Typography>
                <Typography><b>{b.left}</b> / {b.quota}</Typography>
              </Box>
            ))}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>Recent Announcements</Typography>
            {announcements.map((a) => (
              <Box key={a.id} mb={2}>
                <Typography fontWeight={600}>{a.title}</Typography>
                <Typography variant="caption" color="text.secondary">{new Date(a.createdAt).toLocaleDateString()}</Typography>
              </Box>
            ))}
            {announcements.length === 0 && <Typography color="text.secondary">No announcements</Typography>}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EmployeeDashboard;