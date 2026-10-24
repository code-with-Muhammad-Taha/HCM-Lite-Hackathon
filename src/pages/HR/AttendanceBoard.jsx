import { useEffect, useState } from "react";
import { Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, Chip } from "@mui/material";
import { getAllAttendance } from "../../services/attendanceService";

const AttendanceBoard = () => {
  const [rows, setRows] = useState([]);
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => { getAllAttendance().then(setRows); }, []);

  const todayRows = rows.filter((r) => r.date === today);

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={3}>Today's Attendance ({today})</Typography>
      <Paper>
        <Table>
          <TableHead sx={{ bgcolor: "#f8fafc" }}>
            <TableRow>
              <TableCell><b>Employee</b></TableCell><TableCell><b>Check In</b></TableCell>
              <TableCell><b>Check Out</b></TableCell><TableCell><b>Status</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {todayRows.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.name}</TableCell>
                <TableCell>{r.checkIn ? new Date(r.checkIn).toLocaleTimeString() : "—"}</TableCell>
                <TableCell>{r.checkOut ? new Date(r.checkOut).toLocaleTimeString() : "—"}</TableCell>
                <TableCell><Chip label={r.status} color="success" size="small" /></TableCell>
              </TableRow>
            ))}
            {todayRows.length === 0 && <TableRow><TableCell colSpan={4} align="center">No check-ins today</TableCell></TableRow>}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default AttendanceBoard;