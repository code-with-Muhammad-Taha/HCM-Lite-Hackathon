import { useEffect, useState } from "react";
import { Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase/config";

const AuditLog = () => {
  const [logs, setLogs] = useState([]);
  useEffect(() => {
    (async () => {
      const q = query(collection(db, "audit_logs"), orderBy("at", "desc"));
      const snap = await getDocs(q);
      setLogs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    })();
  }, []);

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={3}>Audit Log</Typography>
      <Paper>
        <Table>
          <TableHead sx={{ bgcolor: "#f8fafc" }}>
            <TableRow>
              <TableCell><b>Actor</b></TableCell><TableCell><b>Action</b></TableCell>
              <TableCell><b>Entity</b></TableCell><TableCell><b>Time</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((l) => (
              <TableRow key={l.id}>
                <TableCell>{l.actor || "—"}</TableCell>
                <TableCell>{l.action}</TableCell>
                <TableCell>{l.entity}</TableCell>
                <TableCell>{new Date(l.at).toLocaleString()}</TableCell>
              </TableRow>
            ))}
            {logs.length === 0 && <TableRow><TableCell colSpan={4} align="center">No audit entries</TableCell></TableRow>}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default AuditLog;