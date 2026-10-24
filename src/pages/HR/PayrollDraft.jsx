import { useEffect, useState } from "react";
import { Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, Chip, Button } from "@mui/material";
import { getEmployees } from "../../services/authService";
import { getPayroll, generatePayroll } from "../../services/payrollService";
import { toast } from "react-toastify";

const PayrollDraft = () => {
  const [rows, setRows] = useState([]);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [loading, setLoading] = useState(false);
  const load = () => getPayroll().then(setRows);
  useEffect(() => { load(); }, []);

  const generate = async () => {
    setLoading(true);
    try {
      const emps = await getEmployees();
      if (!emps.length) return toast.warning("No employees found");
      await generatePayroll(month, emps);
      toast.success(`Payroll generated for ${month}`); load();
    } catch (e) { toast.error(e.message); }
    finally { setLoading(false); }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3, alignItems: "center" }}>
        <Typography variant="h4" fontWeight={700}>Payroll Draft</Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }} />
          <Button variant="contained" onClick={generate} disabled={loading}>{loading ? "Generating..." : "Generate Payroll"}</Button>
        </Box>
      </Box>
      <Paper>
        <Table>
          <TableHead sx={{ bgcolor: "#f8fafc" }}>
            <TableRow>
              <TableCell><b>Employee</b></TableCell><TableCell><b>Month</b></TableCell>
              <TableCell><b>Basic</b></TableCell><TableCell><b>Gross</b></TableCell>
              <TableCell><b>Tax</b></TableCell><TableCell><b>Net</b></TableCell>
              <TableCell><b>Status</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.name}</TableCell><TableCell>{r.month}</TableCell>
                <TableCell>₨ {r.basic?.toLocaleString()}</TableCell>
                <TableCell>₨ {r.gross?.toLocaleString()}</TableCell>
                <TableCell>₨ {r.tax?.toLocaleString()}</TableCell>
                <TableCell><b>₨ {r.net?.toLocaleString()}</b></TableCell>
                <TableCell><Chip label={r.status} color={r.status === "finalized" ? "success" : "warning"} size="small" /></TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && <TableRow><TableCell colSpan={7} align="center">No payroll yet. Generate!</TableCell></TableRow>}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default PayrollDraft;