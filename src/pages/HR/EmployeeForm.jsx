import { useState } from "react";
import { Box, Typography, Paper, Grid, Alert } from "@mui/material";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db, secondaryAuth } from "../../firebase/config";
import Input from "../../components/Input";
import BasicButtons from "../../components/Button";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const EmployeeForm = () => {
  const { userData } = useAuth();
  const [form, setForm] = useState({
    name: "", email: "", password: "",
    department: "", designation: "", basic: "", phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    setError("");
  };

  const submit = async () => {
    setError("");
    if (!form.name.trim()) return setError("Name required");
    if (!form.email.trim()) return setError("Email required");
    if (form.password.length < 6) return setError("Password 6+ characters");
    if (!form.basic || Number(form.basic) <= 0) return setError("Basic salary required");

    setLoading(true);
    try {
      // ✅ SECONDARY AUTH — HR logged in rahega!
      const res = await createUserWithEmailAndPassword(
        secondaryAuth,
        form.email.trim(),
        form.password
      );

      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        name: form.name.trim(),
        email: form.email.trim(),
        role: "employee",
        department: form.department.trim(),
        designation: form.designation.trim(),
        basic: Number(form.basic),
        phone: form.phone.trim(),
        active: true,
        mustChangePassword: true,
        createdBy: userData?.uid || "hr",
        createdAt: new Date().toISOString(),
      });

      // Secondary auth sign out
      await secondaryAuth.signOut();

      toast.success(`Employee created! Login: ${form.email.trim()}`);
      setForm({ name: "", email: "", password: "", department: "", designation: "", basic: "", phone: "" });
      // ✅ HR logged in rahega, yahan navigate kar sakte ho
      // navigate("/hr/employees");
    } catch (err) {
      console.error("❌", err.code, err.message);
      let msg = err.message;
      if (err.code === "auth/email-already-in-use") msg = "Yeh email already use ho rahi hai";
      else if (err.code === "auth/weak-password") msg = "Password kamzor hai";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={3}>Register Employee</Typography>
      <Paper sx={{ p: 3 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          Employee will get login credentials. First login pe password change karna hoga.
        </Alert>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}><Input label="Full Name" type="name" value={form.name} handler={handleChange} /></Grid>
          <Grid item xs={12} md={6}><Input label="Email" type="email" value={form.email} handler={handleChange} /></Grid>
          <Grid item xs={12} md={6}><Input label="Temporary Password" type="password" value={form.password} handler={handleChange} /></Grid>
          <Grid item xs={12} md={6}><Input label="Department" type="department" value={form.department} handler={handleChange} /></Grid>
          <Grid item xs={12} md={6}><Input label="Designation" type="designation" value={form.designation} handler={handleChange} /></Grid>
          <Grid item xs={12} md={6}><Input label="Basic Salary (PKR)" type="basic" value={form.basic} handler={handleChange} /></Grid>
          <Grid item xs={12} md={6}><Input label="Phone" type="phone" value={form.phone} handler={handleChange} /></Grid>
        </Grid>
        <Box mt={3}>
          <BasicButtons
            title={loading ? "Creating..." : "Create Employee"}
            handler={submit}
            disabled={loading}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default EmployeeForm;