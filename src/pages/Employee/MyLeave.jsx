import { useEffect, useState } from "react";
import { Box, Typography, Paper, Grid, Chip, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import Input from "../../components/Input";
import BasicButtons from "../../components/Button";
import { applyLeave, getMyLeaves } from "../../services/leaveService";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const MyLeave = () => {
  const { user, userData } = useAuth();
  const [form, setForm] = useState({ type: "casual", startDate: "", endDate: "", reason: "" });
  const [leaves, setLeaves] = useState([]);

  const load = () => getMyLeaves(user.uid).then(setLeaves);
  useEffect(() => { if (user) load(); }, [user]);

  const handleChange = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const submit = async () => {
    if (!form.startDate || !form.endDate || !form.reason) return toast.warning("Fill all fields");
    await applyLeave({ uid: user.uid, name: userData.name, ...form });
    toast.success("Leave applied!");
    setForm({ type: "casual", startDate: "", endDate: "", reason: "" });
    load();
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={3}>My Leave</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>Apply for Leave</Typography>
            <Input label="Type (casual/sick/annual)" type="type" value={form.type} handler={handleChange} />
            <Input label="Start Date (YYYY-MM-DD)" type="startDate" value={form.startDate} handler={handleChange} />
            <Input label="End Date (YYYY-MM-DD)" type="endDate" value={form.endDate} handler={handleChange} />
            <Input label="Reason" type="reason" value={form.reason} handler={handleChange} />
            <BasicButtons title="Apply" handler={submit} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={7}>
          <Paper>
            <Table>
              <TableHead sx={{ bgcolor: "#f8fafc" }}>
                <TableRow><TableCell><b>Type</b></TableCell><TableCell><b>From</b></TableCell><TableCell><b>To</b></TableCell><TableCell><b>Status</b></TableCell></TableRow>
              </TableHead>
              <TableBody>
                {leaves.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell>{l.type}</TableCell><TableCell>{l.startDate}</TableCell><TableCell>{l.endDate}</TableCell>
                    <TableCell><Chip label={l.status} color={l.status === "approved" ? "success" : l.status === "rejected" ? "error" : "warning"} size="small" /></TableCell>
                  </TableRow>
                ))}
                {leaves.length === 0 && <TableRow><TableCell colSpan={4} align="center">No leaves yet</TableCell></TableRow>}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MyLeave;