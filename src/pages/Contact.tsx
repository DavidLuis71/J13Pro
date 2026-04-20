import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

export default function Contacto() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    mensaje: "",
  });

  const [status, setStatus] = useState<null | "ok" | "error">(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    if (!form.nombre || !form.email || !form.mensaje) return false;
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      setStatus("error");
      return;
    }

    const numero = "34665691927"; // 👈 WHATSAPP DEL DUEÑO

    const mensaje = `
📩 Nuevo contacto desde la web

👤 Nombre: ${form.nombre}
📧 Email: ${form.email}
📞 Teléfono: ${form.telefono || "No indicado"}

💬 Mensaje:
${form.mensaje}
    `;

    const url = `https://wa.me/${numero}?text=${encodeURIComponent(
      mensaje
    )}`;

    window.open(url, "_blank");

    setStatus("ok");

    setForm({
      nombre: "",
      email: "",
      telefono: "",
      mensaje: "",
    });
  };

  return (
    <Box sx={{ width: "100vw", overflowX: "hidden" }}>
      {/* CONTENIDO */}
      <Box
        sx={{
          maxWidth: 600,
          margin: "auto",
          mt: 5,
          p: 3,
          background: "#111",
          borderRadius: 2,
          color: "#fff",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Contacta con nosotros
        </Typography>

        <Typography sx={{ mb: 3 }}>
          Escríbenos por WhatsApp y te responderemos lo antes posible ⚡
        </Typography>

        {status === "ok" && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Abriendo WhatsApp... 📲
          </Alert>
        )}

        {status === "error" && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Completa los campos obligatorios
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            margin="normal"
            sx={textFieldStyle}
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            margin="normal"
            sx={textFieldStyle}
          />

          <TextField
            fullWidth
            label="Teléfono"
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            margin="normal"
            sx={textFieldStyle}
          />

          <TextField
            fullWidth
            label="Mensaje"
            name="mensaje"
            value={form.mensaje}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={4}
            sx={textFieldStyle}
          />

          <Button
            variant="contained"
            type="submit"
             startIcon={<WhatsAppIcon />}
            fullWidth
            sx={{
              mt: 2,
              backgroundColor: "#25D366", 
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "var(--gold)",
                color: "#000",
              },
            }}
          >
            Enviar por WhatsApp
          </Button>
        </form>
      </Box>
    </Box>
  );
}

const textFieldStyle = {
  input: { color: "#fff" },
  textarea: { color: "#fff" },
  label: { color: "#aaa" },
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "#555" },
    "&:hover fieldset": { borderColor: "#888" },
    "&.Mui-focused fieldset": { borderColor: "#fff" },
  },
};