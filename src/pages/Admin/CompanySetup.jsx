import { useEffect, useState } from "react";
import { Box, Typography, Paper, Grid } from "@mui/material";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import Input from "../../components/Input";
import BasicButtons from "../../components/Button";
import { toast } from "react-toastify";

const CompanySetup = () => {
  const [form, setForm] = useState({
    companyName: "", officeStart: "09:00", graceMinutes: "15",
    halfDayHours: "5", officeLat: "", officeLng: "", radius: "150",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const snap = await getDoc(doc(db, "settings", "company"));
      if (snap.exists()) setForm((p) => ({ ...p, ...snap.data() }));
    })();
  }, []);

  const handleChange = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const save = async () => {
    setLoading(true);
    try {
      await setDoc(doc(db, "settings", "company"), {
        ...form,
        graceMinutes: Number(form.graceMinutes), halfDayHours: Number(form.halfDayHours),
        officeLat: Number(form.officeLat), officeLng: Number(form.officeLng), radius: Number(form.radius),
        weekend: ["Sat", "Sun"], updatedAt: new Date().toISOString(),
      }, { merge: true });
      toast.success("Settings saved!");
    } catch (e) { toast.error(e.message); }
    finally { setLoading(false); }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={3}>Company Setup</Typography>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}><Input label="Company Name" type="companyName" value={form.companyName} handler={handleChange} /></Grid>
          <Grid item xs={12} md={6}><Input label="Office Start (HH:MM)" type="officeStart" value={form.officeStart} handler={handleChange} /></Grid>
          <Grid item xs={12} md={4}><Input label="Grace Minutes" type="graceMinutes" value={form.graceMinutes} handler={handleChange} /></Grid>
          <Grid item xs={12} md={4}><Input label="Half Day Hours" type="halfDayHours" value={form.halfDayHours} handler={handleChange} /></Grid>
          <Grid item xs={12} md={4}><Input label="Radius (meters)" type="radius" value={form.radius} handler={handleChange} /></Grid>
          <Grid item xs={12} md={6}><Input label="Office Latitude" type="officeLat" value={form.officeLat} handler={handleChange} /></Grid>
          <Grid item xs={12} md={6}><Input label="Office Longitude" type="officeLng" value={form.officeLng} handler={handleChange} /></Grid>
        </Grid>
        <Box mt={3}><BasicButtons title={loading ? "Saving..." : "Save Settings"} handler={save} /></Box>
      </Paper>
    </Box>
  );
};

export default CompanySetup;