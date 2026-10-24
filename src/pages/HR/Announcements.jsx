import { useEffect, useState } from "react";
import { Box, Typography, Paper, Grid } from "@mui/material";
import { collection, addDoc, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase/config";
import Input from "../../components/Input";
import BasicButtons from "../../components/Button";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const Announcements = () => {
  const { userData } = useAuth();
  const [form, setForm] = useState({ title: "", body: "" });
  const [list, setList] = useState([]);

  const load = async () => {
    const snap = await getDocs(query(collection(db, "announcements"), orderBy("createdAt", "desc")));
    setList(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };
  useEffect(() => { load(); }, []);

  const post = async () => {
    if (!form.title || !form.body) return toast.warning("Fill all fields");
    await addDoc(collection(db, "announcements"), {
      ...form, author: userData?.name || "HR", createdAt: new Date().toISOString(),
    });
    toast.success("Posted!"); setForm({ title: "", body: "" }); load();
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={3}>Announcements</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>Post New</Typography>
            <Input label="Title" type="title" value={form.title} handler={(k, v) => setForm((p) => ({ ...p, [k]: v }))} />
            <Input label="Message" type="body" value={form.body} handler={(k, v) => setForm((p) => ({ ...p, [k]: v }))} />
            <BasicButtons title="Post" handler={post} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={7}>
          {list.map((a) => (
            <Paper key={a.id} sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>{a.title}</Typography>
              <Typography variant="body2" color="text.secondary">{a.body}</Typography>
              <Typography variant="caption" display="block" mt={1}>— {a.author} • {new Date(a.createdAt).toLocaleDateString()}</Typography>
            </Paper>
          ))}
          {list.length === 0 && <Paper sx={{ p: 3, textAlign: "center" }}>No announcements yet</Paper>}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Announcements;