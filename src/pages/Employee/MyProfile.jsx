import { useState } from "react";
import { Box, Typography, Paper, Grid } from "@mui/material";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";
import Input from "../../components/Input";
import BasicButtons from "../../components/Button";
import { toast } from "react-toastify";

const MyProfile = () => {
  const { user, userData } = useAuth();
  const [form, setForm] = useState({
    phone: userData?.phone || "", address: userData?.address || "",
  });
  const handleChange = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const save = async () => {
    await updateDoc(doc(db, "users", user.uid), { ...form });
    toast.success("Profile updated!");
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={3}>My Profile</Typography>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}><Input label="Name" type="name" value={userData?.name || ""} handler={() => {}} disabled /></Grid>
          <Grid item xs={12} md={6}><Input label="Email" type="email" value={userData?.email || ""} handler={() => {}} disabled /></Grid>
          <Grid item xs={12} md={6}><Input label="Department" type="department" value={userData?.department || ""} handler={() => {}} disabled /></Grid>
          <Grid item xs={12} md={6}><Input label="Designation" type="designation" value={userData?.designation || ""} handler={() => {}} disabled /></Grid>
          <Grid item xs={12} md={6}><Input label="Phone" type="phone" value={form.phone} handler={handleChange} /></Grid>
          <Grid item xs={12} md={6}><Input label="Address" type="address" value={form.address} handler={handleChange} /></Grid>
        </Grid>
        <Box mt={3}><BasicButtons title="Save Changes" handler={save} /></Box>
      </Paper>
    </Box>
  );
};

export default MyProfile;