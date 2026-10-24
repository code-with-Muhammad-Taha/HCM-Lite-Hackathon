import { useEffect, useState } from "react";
import { Box, Typography, Paper, Grid, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/config";
import Input from "../../components/Input";
import BasicButtons from "../../components/Button";
import { toast } from "react-toastify";

const LeaveTypes = () => {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", quota: "14" });

  const load = async () => {
    const snap = await getDocs(collection(db, "leaveTypes"));
    setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!form.name.trim()) return toast.warning("Enter name");
    await addDoc(collection(db, "leaveTypes"), { name: form.name, quota: Number(form.quota), createdAt: new Date().toISOString() });
    toast.success("Added"); setForm({ name: "", quota: "14" }); setOpen(false); load();
  };

  const remove = async (id) => {
    if (!window.confirm("Delete?")) return;
    await deleteDoc(doc(db, "leaveTypes", id));
    toast.success("Deleted"); load();
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>Leave Types</Typography>
        <BasicButtons title={<><AddIcon /> Add</>} handler={() => setOpen(true)} />
      </Box>
      <Grid container spacing={2}>
        {items.map((it) => (
          <Grid item xs={12} sm={6} md={4} key={it.id}>
            <Paper sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box><Chip label={it.name} color="primary" /><Typography variant="caption" display="block" mt={1}>Quota: {it.quota} days</Typography></Box>
              <IconButton color="error" onClick={() => remove(it.id)}><DeleteIcon /></IconButton>
            </Paper>
          </Grid>
        ))}
        {items.length === 0 && <Grid item xs={12}><Paper sx={{ p: 4, textAlign: "center" }}>No leave types yet</Paper></Grid>}
      </Grid>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Add Leave Type</DialogTitle>
        <DialogContent>
          <Input label="Name" type="name" value={form.name} handler={(k, v) => setForm((p) => ({ ...p, [k]: v }))} />
          <Input label="Yearly Quota" type="quota" value={form.quota} handler={(k, v) => setForm((p) => ({ ...p, [k]: v }))} />
        </DialogContent>
        <DialogActions>
          <BasicButtons title="Cancel" handler={() => setOpen(false)} />
          <BasicButtons title="Add" handler={add} />
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LeaveTypes;