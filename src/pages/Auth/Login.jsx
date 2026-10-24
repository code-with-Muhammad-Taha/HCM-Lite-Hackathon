import { useState } from "react";
import { Box, Paper, Typography, Container } from "@mui/material";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import BasicButtons from "../../components/Button";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const loginHandler = async () => {
    if (!form.email || !form.password) return toast.warning("Fill all fields");
    setLoading(true);
    try {
      const res = await signInWithEmailAndPassword(auth, form.email, form.password);
      const snap = await getDoc(doc(db, "users", res.user.uid));
      if (!snap.exists()) {
        toast.error("User record not found. Contact Admin.");
        return;
      }
      const data = snap.data();
      if (!data.active) {
        toast.error("Account deactivated.");
        return;
      }
      if (data.mustChangePassword) {
        toast.info("Please change your password");
        navigate("/change-password");
        return;
      }
      toast.success("Welcome back!");
      if (data.role === "admin") navigate("/admin");
      else if (data.role === "hr") navigate("/hr");
      else navigate("/employee");
    } catch (err) {
      toast.error(err.code === "auth/invalid-credential" ? "Invalid credentials" : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", background: "linear-gradient(135deg,#0f172a,#1e3a8a)", py: 4 }}>
      <Container maxWidth="xs">
        <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" fontWeight={700} align="center" gutterBottom>HCM Lite</Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Human Capital Management System
          </Typography>
          <Input label="Email" type="email" value={form.email} handler={handleInputChange} />
          <Input label="Password" type="password" value={form.password} handler={handleInputChange} />
          <BasicButtons title={loading ? "Signing in..." : "Login"} handler={loginHandler} disabled={loading} />
          <Typography variant="caption" display="block" align="center" sx={{ mt: 2, color: "text.secondary" }}>
            First time? <a href="/first-run" style={{ color: "#3b82f6" }}>Setup Admin</a>
          </Typography>
        </Paper>
      </Container>
      <ToastContainer position="top-right" />
    </Box>
  );
};

export default Login;