import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

export default function Input({ value, label, type, handler, disabled = false }) {
  return (
    <Box sx={{ mb: 2, mt: 2 }}>
      <TextField
        fullWidth
        label={label}
        variant="outlined"
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => handler(type, e.target.value)}
      />
    </Box>
  );
}