import { useEffect, useState } from "react";
import { Box, Typography, Paper, Grid, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/config";
import Input from "../../components/Input";
import BasicButtons from "../../components/Button";
import { toast } from "react-toastify";

const Departments = () => {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "" });

  const load = async () => {
    const snap = await getDocs(collection(db, "departments"));
    setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!form.name.trim()) return toast.warning("Enter name");
    await addDoc(collection(db, "departments"), { name: form.name, createdAt: new Date().toISOString() });
    toast.success("Added"); setForm({ name: "" }); setOpen(false); load();
  };

  const remove = async (id) => {
    if (!window.confirm("Delete?")) return;
    await deleteDoc(doc(db, "departments", id));
    toast.success("Deleted"); load();
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>Departments</Typography>
        <BasicButtons title={<><AddIcon /> Add</>} handler={() => setOpen(true)} />
      </Box>
      <Grid container spacing={2}>
        {items.map((it) => (
          <Grid item xs={12} sm={6} md={4} key={it.id}>
            <Paper sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Chip label={it.name} color="primary" />
              <IconButton color="error" onClick={() => remove(it.id)}><DeleteIcon /></IconButton>
            </Paper>
          </Grid>
        ))}
        {items.length === 0 && <Grid item xs={12}><Paper sx={{ p: 4, textAlign: "center" }}>No departments yet</Paper></Grid>}
      </Grid>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Add Department</DialogTitle>
        <DialogContent><Input label="Department Name" type="name" value={form.name} handler={(k, v) => setForm({ [k]: v })} /></DialogContent>
        <DialogActions>
          <BasicButtons title="Cancel" handler={() => setOpen(false)} />
          <BasicButtons title="Add" handler={add} />
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Departments;