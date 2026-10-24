import { useState } from "react";
import { Box, Typography, Paper, TextField, Button, Stack, Avatar } from "@mui/material";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";
import { useAuth } from "../../context/AuthContext";
import { askAI } from "../../services/aiService";

const AIAssistant = () => {
  const { userData } = useAuth();
  const [messages, setMessages] = useState([
    { role: "ai", text: `Hi ${userData?.name}! I'm your HCM assistant. Ask me about attendance, leaves, payroll, or policies.` },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim()) return;
    const q = input;
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput(""); setLoading(true);
    try {
      const answer = await askAI(q, userData?.role, userData);
      setMessages((m) => [...m, { role: "ai", text: answer }]);
    } catch { setMessages((m) => [...m, { role: "ai", text: "Sorry, something went wrong." }]); }
    finally { setLoading(false); }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={3}>AI Assistant</Typography>
      <Paper sx={{ p: 2, height: "60vh", overflowY: "auto", mb: 2 }}>
        {messages.map((m, i) => (
          <Stack key={i} direction="row" spacing={1} sx={{ mb: 2, flexDirection: m.role === "user" ? "row-reverse" : "row" }}>
            <Avatar sx={{ bgcolor: m.role === "user" ? "#3b82f6" : "#10b981" }}>
              {m.role === "user" ? <PersonIcon /> : <SmartToyIcon />}
            </Avatar>
            <Paper sx={{ p: 1.5, maxWidth: "70%", bgcolor: m.role === "user" ? "#eff6ff" : "#f0fdf4", borderRadius: 2 }}>
              <Typography variant="body2">{m.text}</Typography>
            </Paper>
          </Stack>
        ))}
        {loading && <Typography variant="caption" color="text.secondary">AI is typing...</Typography>}
      </Paper>
      <Stack direction="row" spacing={1}>
        <TextField fullWidth placeholder="Ask anything..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} />
        <Button variant="contained" onClick={send} disabled={loading}>Send</Button>
      </Stack>
    </Box>
  );
};

export default AIAssistant;