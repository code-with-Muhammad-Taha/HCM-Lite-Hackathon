import { useEffect, useState } from "react";
import { Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, Chip, Button } from "@mui/material";
import { getAllLeaves, approveLeave } from "../../services/leaveService";
import { toast } from "react-toastify";

const LeaveApprovals = () => {
  const [leaves, setLeaves] = useState([]);
  const load = () => getAllLeaves().then(setLeaves);
  useEffect(() => { load(); }, []);

  const handle = async (id, status) => {
    await approveLeave(id, status, status === "approved" ? "OK" : "Rejected by HR");
    toast.success(`Leave ${status}`); load();
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={3}>Leave Approvals</Typography>
      <Paper>
        <Table>
          <TableHead sx={{ bgcolor: "#f8fafc" }}>
            <TableRow>
              <TableCell><b>Employee</b></TableCell><TableCell><b>Type</b></TableCell>
              <TableCell><b>From</b></TableCell><TableCell><b>To</b></TableCell>
              <TableCell><b>Reason</b></TableCell><TableCell><b>Status</b></TableCell>
              <TableCell><b>Action</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaves.map((l) => (
              <TableRow key={l.id}>
                <TableCell>{l.name || "—"}</TableCell>
                <TableCell>{l.type}</TableCell>
                <TableCell>{l.startDate}</TableCell>
                <TableCell>{l.endDate}</TableCell>
                <TableCell>{l.reason}</TableCell>
                <TableCell><Chip label={l.status} color={l.status === "approved" ? "success" : l.status === "rejected" ? "error" : "warning"} size="small" /></TableCell>
                <TableCell>
                  {l.status === "pending" && (
                    <>
                      <Button size="small" color="success" onClick={() => handle(l.id, "approved")}>Approve</Button>
                      <Button size="small" color="error" onClick={() => handle(l.id, "rejected")}>Reject</Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {leaves.length === 0 && <TableRow><TableCell colSpan={7} align="center">No leave requests</TableCell></TableRow>}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default LeaveApprovals;