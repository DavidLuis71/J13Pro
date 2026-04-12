import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Contacto() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    mensaje: "",
  });

  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      setStatus("error");
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/Version2/Contact.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.ok) {
        setStatus("ok");
        setForm({
          nombre: "",
          email: "",
          telefono: "",
          mensaje: "",
        });
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    }

    setLoading(false);
  };

  return (
    <Box sx={{ width: "100vw", overflowX: "hidden" }}>
      
      {/* 👇 HEADER */}
      <Header />

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
          Envíanos tu mensaje y te responderemos lo antes posible.
        </Typography>

        {status === "ok" && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Mensaje enviado correctamente 🔥
          </Alert>
        )}

        {status === "error" && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Revisa los campos o inténtalo más tarde
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

          <Box sx={{ mt: 2, position: "relative" }}>
            <Button
              variant="contained"
              type="submit"
              disabled={loading}
              fullWidth
            >
              Enviar
            </Button>

            {loading && (
              <CircularProgress
                size={24}
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  marginTop: "-12px",
                  marginLeft: "-12px",
                }}
              />
            )}
          </Box>
        </form>
      </Box>

      {/* 👇 FOOTER (opcional) */}
      <Footer />
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