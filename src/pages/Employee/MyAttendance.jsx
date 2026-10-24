import { useEffect, useState } from "react";
import { Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { getMyAttendance } from "../../services/attendanceService";

const MyAttendance = () => {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  useEffect(() => { if (user) getMyAttendance(user.uid).then(setRows); }, [user]);

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={3}>My Attendance</Typography>
      <Paper>
        <Table>
          <TableHead sx={{ bgcolor: "#f8fafc" }}>
            <TableRow>
              <TableCell><b>Date</b></TableCell><TableCell><b>Check In</b></TableCell>
              <TableCell><b>Check Out</b></TableCell><TableCell><b>Status</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.date}</TableCell>
                <TableCell>{r.checkIn ? new Date(r.checkIn).toLocaleTimeString() : "—"}</TableCell>
                <TableCell>{r.checkOut ? new Date(r.checkOut).toLocaleTimeString() : "—"}</TableCell>
                <TableCell>{r.status}</TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && <TableRow><TableCell colSpan={4} align="center">No records</TableCell></TableRow>}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default MyAttendance;