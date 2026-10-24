import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Button,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getEmployees } from "../../services/authService";

const Employees = () => {
  const [list, setList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getEmployees()
      .then(setList)
      .catch(() => toast.error("Failed to load employees"));
  }, []);

  // Export employees to CSV
  const exportCSV = () => {
    if (!list.length) {
      return toast.warning("No employees to export");
    }

    const headers = [
      "Name",
      "Email",
      "Department",
      "Designation",
      "Basic Salary",
      "Phone",
      "Status",
    ];

    const rows = list.map((e) => [
      e.name || "",
      e.email || "",
      e.department || "",
      e.designation || "",
      e.basic || 0,
      e.phone || "",
      e.active ? "Active" : "Inactive",
    ]);

    // Escape quotes and protect CSV formatting
    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\r\n");

    // Add BOM for proper Excel UTF-8 compatibility
    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `employees_${new Date()
      .toISOString()
      .split("T")[0]}.csv`;

    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);

    toast.success("Exported!");
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 3,
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h4" fontWeight={700}>
          Employees
        </Typography>

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={exportCSV}
          >
            Export CSV
          </Button>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/hr/employees/new")}
          >
            Add Employee
          </Button>
        </Box>
      </Box>

      <Paper>
        <Table>
          <TableHead sx={{ bgcolor: "#f8fafc" }}>
            <TableRow>
              <TableCell>
                <b>Name</b>
              </TableCell>
              <TableCell>
                <b>Email</b>
              </TableCell>
              <TableCell>
                <b>Department</b>
              </TableCell>
              <TableCell>
                <b>Basic Salary</b>
              </TableCell>
              <TableCell>
                <b>Status</b>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {list.map((e) => (
              <TableRow key={e.id}>
                <TableCell>{e.name}</TableCell>
                <TableCell>{e.email}</TableCell>
                <TableCell>{e.department || "—"}</TableCell>
                <TableCell>
                  ₨ {e.basic?.toLocaleString() || 0}
                </TableCell>
                <TableCell>
                  <Chip
                    label={e.active ? "Active" : "Inactive"}
                    color={e.active ? "success" : "default"}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}

            {list.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No employees yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default Employees;