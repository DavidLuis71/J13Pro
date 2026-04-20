import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
} from "@mui/material";
import { useState } from "react";
import { supabase } from "../api/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function LoginAdmin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
  setErrorMsg("Credenciales incorrectas");
  return;
}

    navigate("/admin");
  };

  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          backgroundColor: "var(--black-text-bg)",
          color: "white",
          p: 4,
          borderRadius: 4,
          width: "100%",
          maxWidth: 400,
          textAlign: "center",
          boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
        }}
      >
        {/* TÍTULO */}
        <Typography
          variant="h4"
          sx={{
            mb: 3,
            color: "var(--orange)",
            fontFamily: "Permanent Marker",
          }}
        >
          Admin Login
        </Typography>

        {/* EMAIL */}
        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          margin="normal"
          onChange={(e) => setEmail(e.target.value)}
          sx={{
            input: { color: "white" },
            label: { color: "var(--orange)" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "var(--gold)",
              },
              "&:hover fieldset": {
                borderColor: "var(--orange)",
              },
            },
          }}
        />

        {/* PASSWORD */}
        <TextField
          fullWidth
          type="password"
          label="Contraseña"
          variant="outlined"
          margin="normal"
          onChange={(e) => setPassword(e.target.value)}
          sx={{
            input: { color: "white" },
            label: { color: "var(--orange)" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "var(--gold)",
              },
              "&:hover fieldset": {
                borderColor: "var(--orange)",
              },
            },
          }}
        />

        {/* BOTÓN */}
        <Button
          fullWidth
          variant="contained"
          onClick={handleLogin}
          sx={{
            mt: 3,
            backgroundColor: "var(--orange)",
            fontWeight: "bold",
            py: 1.2,
            borderRadius: 3,
            "&:hover": {
              backgroundColor: "var(--gold)",
              color: "#000",
              transform: "scale(1.03)",
            },
          }}
        >
          Entrar
        </Button>
        {errorMsg && (
  <Typography sx={{ mt: 2, color: "red" }}>
    {errorMsg}
  </Typography>
)}
      </Paper>
    </Box>
  );
}