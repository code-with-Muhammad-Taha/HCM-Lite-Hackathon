import { useState, useEffect } from "react";
import { Box, Paper, Typography, Container, Stepper, Step, StepLabel, Alert } from "@mui/material";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/config";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import BasicButtons from "../../components/Button";

const FirstRun = () => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    companyName: "",
    email: "",
    password: "",
    fullName: "",
    officeStart: "09:00",
    graceMinutes: "15",
  });
  const navigate = useNavigate();

  // ✅ BYPASS — koi check nahi, form hamesha dikhega
  useEffect(() => {
    // nothing — just show form
  }, []);

  const handleChange = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    setError("");
  };

  const createAdmin = async () => {
    setError("");

    if (!form.companyName.trim()) return setError("Company name required");
    if (!form.fullName.trim()) return setError("Full name required");
    if (!form.email.trim()) return setError("Email required");
    if (form.password.length < 6) return setError("Password must be 6+ characters");

    setLoading(true);
    console.log("🚀 Creating admin...");

    try {
      const res = await createUserWithEmailAndPassword(auth, form.email.trim(), form.password);
      console.log("✅ Auth user:", res.user.uid);

      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        email: form.email.trim(),
        name: form.fullName.trim(),
        role: "admin",
        active: true,
        mustChangePassword: false,
        createdAt: new Date().toISOString(),
      });
      console.log("✅ User doc saved");

      await setDoc(doc(db, "settings", "company"), {
        companyName: form.companyName.trim(),
        officeStart: form.officeStart,
        graceMinutes: Number(form.graceMinutes),
        halfDayHours: 5,
        weekend: ["Sat", "Sun"],
        officeLat: 24.8607,
        officeLng: 67.0011,
        radius: 150,
        createdAt: new Date().toISOString(),
      });
      console.log("✅ Settings saved");

      toast.success("Admin created! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error("❌ ERROR:", err.code, err.message);
      let msg = err.message;
      if (err.code === "auth/email-already-in-use") msg = "Yeh email already use ho rahi hai";
      else if (err.code === "auth/weak-password") msg = "Password kamzor — 6+ chars chahiye";
      else if (err.code === "auth/operation-not-allowed") msg = "Firebase Auth → Email/Password enable karo";
      else if (err.code === "auth/invalid-api-key") msg = "Firebase API key galat hai";
      else if (err.message?.includes("permission")) msg = "Firestore rules test mode karo";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", background: "linear-gradient(135deg,#0f172a,#1e3a8a)", py: 4 }}>
      <Container maxWidth="sm">
        <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" fontWeight={700} align="center" gutterBottom>
            🚀 First Run Setup
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Create your company and admin account
          </Typography>

          <Stepper activeStep={step} sx={{ mb: 4 }}>
            <Step><StepLabel>Company</StepLabel></Step>
            <Step><StepLabel>Admin</StepLabel></Step>
          </Stepper>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {step === 0 ? (
            <>
              <Input label="Company Name" type="companyName" value={form.companyName} handler={handleChange} />
              <Input label="Office Start (HH:MM)" type="officeStart" value={form.officeStart} handler={handleChange} />
              <Input label="Grace Minutes" type="graceMinutes" value={form.graceMinutes} handler={handleChange} />
              <BasicButtons title="Next →" handler={() => setStep(1)} />
            </>
          ) : (
            <>
              <Input label="Full Name" type="fullName" value={form.fullName} handler={handleChange} />
              <Input label="Admin Email" type="email" value={form.email} handler={handleChange} />
              <Input label="Password (min 6 chars)" type="password" value={form.password} handler={handleChange} />
              <BasicButtons title={loading ? "Creating..." : "Create Admin"} handler={createAdmin} disabled={loading} />
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <Typography variant="caption" color="primary" sx={{ cursor: "pointer" }} onClick={() => setStep(0)}>
                  ← Back
                </Typography>
              </Box>
            </>
          )}
        </Paper>
      </Container>
      <ToastContainer position="top-right" />
    </Box>
  );
};

export default FirstRun;