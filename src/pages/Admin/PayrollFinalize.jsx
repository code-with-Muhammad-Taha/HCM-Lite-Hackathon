import { useEffect, useState } from "react";
import { Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, Chip, Button } from "@mui/material";
import { getPayroll, finalizePayroll } from "../../services/payrollService";
import { toast } from "react-toastify";

const PayrollFinalize = () => {
  const [rows, setRows] = useState([]);
  const load = () => getPayroll().then(setRows);
  useEffect(() => { load(); }, []);

  const handle = async (id) => {
    if (!window.confirm("Finalize this payroll? It will be locked.")) return;
    await finalizePayroll(id);
    toast.success("Finalized"); load();
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={3}>Payroll Finalize</Typography>
      <Paper>
        <Table>
          <TableHead sx={{ bgcolor: "#f8fafc" }}>
            <TableRow>
              <TableCell><b>Employee</b></TableCell><TableCell><b>Month</b></TableCell>
              <TableCell><b>Gross</b></TableCell><TableCell><b>Tax</b></TableCell>
              <TableCell><b>Net</b></TableCell><TableCell><b>Status</b></TableCell>
              <TableCell><b>Action</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.name}</TableCell><TableCell>{r.month}</TableCell>
                <TableCell>₨ {r.gross?.toLocaleString()}</TableCell>
                <TableCell>₨ {r.tax?.toLocaleString()}</TableCell>
                <TableCell><b>₨ {r.net?.toLocaleString()}</b></TableCell>
                <TableCell><Chip label={r.status} color={r.status === "finalized" ? "success" : "warning"} size="small" /></TableCell>
                <TableCell>
                  {r.status === "draft" && <Button size="small" variant="contained" onClick={() => handle(r.id)}>Finalize</Button>}
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && <TableRow><TableCell colSpan={7} align="center">No payroll records</TableCell></TableRow>}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default PayrollFinalize;