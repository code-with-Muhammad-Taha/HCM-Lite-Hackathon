import { useState } from "react";
import { Box, Paper, Typography, Container } from "@mui/material";
import { updatePassword } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/config";
import Input from "../../components/Input";
import BasicButtons from "../../components/Button";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const { user, userData } = useAuth();
  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const submit = async () => {
    if (form.newPassword.length < 6) return toast.warning("Password must be 6+ characters");
    if (form.newPassword !== form.confirmPassword) return toast.warning("Passwords don't match");
    setLoading(true);
    try {
      await updatePassword(user, form.newPassword);
      await updateDoc(doc(db, "users", user.uid), { mustChangePassword: false });
      toast.success("Password changed! Welcome.");
      setTimeout(() => {
        if (userData?.role === "admin") navigate("/admin");
        else if (userData?.role === "hr") navigate("/hr");
        else navigate("/employee");
      }, 1000);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", background: "linear-gradient(135deg,#0f172a,#1e3a8a)" }}>
      <Container maxWidth="xs">
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" fontWeight={700} textAlign="center" gutterBottom>
            🔐 Change Password
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
            First login — please set a new password
          </Typography>
          <Input label="New Password" type="newPassword" value={form.newPassword} handler={handleChange} />
          <Input label="Confirm Password" type="confirmPassword" value={form.confirmPassword} handler={handleChange} />
          <BasicButtons title={loading ? "Saving..." : "Change Password"} handler={submit} />
        </Paper>
      </Container>
      <ToastContainer position="top-right" />
    </Box>
  );
};

export default ChangePassword;