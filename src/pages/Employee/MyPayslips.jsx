import { useEffect, useState } from "react";
import { Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, Chip, Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { useAuth } from "../../context/AuthContext";
import { getMyPayroll } from "../../services/payrollService";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";

const MyPayslips = () => {
  const { user, userData } = useAuth();
  const [rows, setRows] = useState([]);
  useEffect(() => { if (user) getMyPayroll(user.uid).then(setRows); }, [user]);

  const downloadPDF = (r) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("PAYSLIP", 105, 15, { align: "center" });
    doc.setFontSize(12);
    doc.text(`Employee: ${userData?.name}`, 14, 30);
    doc.text(`Month: ${r.month}`, 14, 38);
    doc.text(`Email: ${userData?.email}`, 14, 46);
    autoTable(doc, {
      startY: 55,
      head: [["Description", "Amount (PKR)"]],
      body: [
        ["Basic Salary", r.basic?.toLocaleString()],
        ["Gross Salary", r.gross?.toLocaleString()],
        ["Income Tax", `-${r.tax?.toLocaleString()}`],
        ["Net Pay", r.net?.toLocaleString()],
      ],
    });
    doc.save(`payslip_${r.month}_${userData?.name}.pdf`);
    toast.success("PDF downloaded!");
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={3}>My Payslips</Typography>
      <Paper>
        <Table>
          <TableHead sx={{ bgcolor: "#f8fafc" }}>
            <TableRow>
              <TableCell><b>Month</b></TableCell><TableCell><b>Basic</b></TableCell>
              <TableCell><b>Gross</b></TableCell><TableCell><b>Tax</b></TableCell>
              <TableCell><b>Net</b></TableCell><TableCell><b>Status</b></TableCell>
              <TableCell><b>PDF</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.month}</TableCell>
                <TableCell>₨ {r.basic?.toLocaleString()}</TableCell>
                <TableCell>₨ {r.gross?.toLocaleString()}</TableCell>
                <TableCell>₨ {r.tax?.toLocaleString()}</TableCell>
                <TableCell><b>₨ {r.net?.toLocaleString()}</b></TableCell>
                <TableCell><Chip label={r.status} color={r.status === "finalized" ? "success" : "warning"} size="small" /></TableCell>
                <TableCell>
                  <Button size="small" variant="outlined" startIcon={<DownloadIcon />} onClick={() => downloadPDF(r)}>PDF</Button>
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && <TableRow><TableCell colSpan={7} align="center">No payslips yet</TableCell></TableRow>}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default MyPayslips;