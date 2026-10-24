import { useEffect, useState } from "react";
import { Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/config";
import Input from "../../components/Input";
import BasicButtons from "../../components/Button";
import { toast } from "react-toastify";

const Holidays = () => {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", date: "" });

  const load = async () => {
    const snap = await getDocs(collection(db, "holidays"));
    setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!form.name || !form.date) return toast.warning("Fill fields");
    await addDoc(collection(db, "holidays"), { name: form.name, date: form.date, createdAt: new Date().toISOString() });
    toast.success("Added"); setForm({ name: "", date: "" }); setOpen(false); load();
  };

  const remove = async (id) => {
    if (!window.confirm("Delete?")) return;
    await deleteDoc(doc(db, "holidays", id));
    toast.success("Deleted"); load();
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>Public Holidays</Typography>
        <BasicButtons title={<><AddIcon /> Add</>} handler={() => setOpen(true)} />
      </Box>
      <Paper>
        <Table>
          <TableHead sx={{ bgcolor: "#f8fafc" }}>
            <TableRow><TableCell><b>Name</b></TableCell><TableCell><b>Date</b></TableCell><TableCell><b>Action</b></TableCell></TableRow>
          </TableHead>
          <TableBody>
            {items.map((it) => (
              <TableRow key={it.id}>
                <TableCell>{it.name}</TableCell><TableCell>{it.date}</TableCell>
                <TableCell><IconButton color="error" onClick={() => remove(it.id)}><DeleteIcon /></IconButton></TableCell>
              </TableRow>
            ))}
            {items.length === 0 && <TableRow><TableCell colSpan={3} align="center">No holidays yet</TableCell></TableRow>}
          </TableBody>
        </Table>
      </Paper>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Add Holiday</DialogTitle>
        <DialogContent>
          <Input label="Holiday Name" type="name" value={form.name} handler={(k, v) => setForm((p) => ({ ...p, [k]: v }))} />
          <Input label="Date (YYYY-MM-DD)" type="date" value={form.date} handler={(k, v) => setForm((p) => ({ ...p, [k]: v }))} />
        </DialogContent>
        <DialogActions>
          <BasicButtons title="Cancel" handler={() => setOpen(false)} />
          <BasicButtons title="Add" handler={add} />
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Holidays;