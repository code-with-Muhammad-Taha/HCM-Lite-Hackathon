import Button from "@mui/material/Button";

export default function BasicButtons({ title, handler, disabled = false, variant = "contained", color = "primary" }) {
  return (
    <Button
      onClick={handler}
      variant={variant}
      color={color}
      disabled={disabled}
      fullWidth
      sx={{ mt: 2, py: 1.2, fontWeight: 600 }}
    >
      {title}
    </Button>
  );
}