import { useState } from "react";
import { Box, Typography, Paper, Grid, Alert } from "@mui/material";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db, secondaryAuth } from "../../firebase/config";
import Input from "../../components/Input";
import BasicButtons from "../../components/Button";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const CreateHR = () => {
  const { userData } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    setError("");
  };

  const submit = async () => {
    setError("");
    if (!form.name.trim()) return setError("Name required");
    if (!form.email.trim()) return setError("Email required");
    if (form.password.length < 6) return setError("Password 6+ characters");

    setLoading(true);
    try {
      // ✅ SECONDARY AUTH use karo — current user (Admin) logged in rahega
      const res = await createUserWithEmailAndPassword(
        secondaryAuth,
        form.email.trim(),
        form.password
      );

      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        name: form.name.trim(),
        email: form.email.trim(),
        role: "hr",
        active: true,
        mustChangePassword: true,
        createdBy: userData?.uid || "admin",
        createdAt: new Date().toISOString(),
      });

      // Secondary auth se sign out (safety)
      await secondaryAuth.signOut();

      toast.success(`HR created! Login: ${form.email.trim()}`);
      setForm({ name: "", email: "", password: "" });
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
      <Typography variant="h4" fontWeight={700} mb={3}>Create HR Login</Typography>
      <Paper sx={{ p: 3, maxWidth: 600 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          HR will login with these credentials. First login pe password change karna hoga.
        </Alert>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Input label="HR Name" type="name" value={form.name} handler={handleChange} />
        <Input label="HR Email" type="email" value={form.email} handler={handleChange} />
        <Input label="Temporary Password (6+ chars)" type="password" value={form.password} handler={handleChange} />
        <BasicButtons
          title={loading ? "Creating..." : "Create HR"}
          handler={submit}
          disabled={loading}
        />
      </Paper>
    </Box>
  );
};

export default CreateHR;