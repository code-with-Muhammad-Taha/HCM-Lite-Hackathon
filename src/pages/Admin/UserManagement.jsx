import { useEffect, useState } from "react";
import { Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, Chip, Switch } from "@mui/material";
import { getAllUsers, toggleUserActive } from "../../services/authService";
import { toast } from "react-toastify";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const load = () => getAllUsers().then(setUsers);
  useEffect(() => { load(); }, []);

  const toggle = async (uid, current) => {
    await toggleUserActive(uid, !current);
    toast.success("Updated"); load();
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={3}>User Management</Typography>
      <Paper>
        <Table>
          <TableHead sx={{ bgcolor: "#f8fafc" }}>
            <TableRow>
              <TableCell><b>Name</b></TableCell><TableCell><b>Email</b></TableCell>
              <TableCell><b>Role</b></TableCell><TableCell><b>Active</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell><Chip label={u.role} color={u.role === "admin" ? "error" : u.role === "hr" ? "warning" : "primary"} size="small" /></TableCell>
                <TableCell>
                  <Switch checked={u.active} onChange={() => toggle(u.id, u.active)} disabled={u.role === "admin"} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default UserManagement;