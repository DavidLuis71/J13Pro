import {
  Box,
  Typography,
  Button,
  Paper,
} from "@mui/material";

import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import TrainIcon from "@mui/icons-material/Train";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import InfoIcon from "@mui/icons-material/Info";

import { useState } from "react";

export default function ComoLlegar() {
  const [tab, setTab] = useState("bus");

  const destination = "C. el Castro, 24I, Santander";

  // 📍 GEOLOCALIZACIÓN → abre ruta directamente
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      alert("Tu navegador no soporta geolocalización");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        const url = `https://www.google.com/maps/dir/?api=1&origin=${lat},${lng}&destination=${encodeURIComponent(destination)}`;

        window.open(url, "_blank");
      },
      () => {
        alert("No se pudo obtener tu ubicación");
      }
    );
  };

  const renderContent = () => {
    switch (tab) {
      case "bus":
        return (
          <>
            <Typography sx={textStyle}>
              Líneas urbanas cercanas:
            </Typography>
            <ul>
              <li>Línea 3 → Calle la Peña (nº 87)</li>
              <li>Línea 7 → Luis Quintanilla Isasi (nº 482)</li>
              <li>Línea 24 → Joaquín Rodrigo Díez (nº 455)</li>
              <li>Línea 24 → Camarreal (nº 478)</li>
            </ul>
          </>
        );

      case "tren":
        return (
          <>
            <Typography sx={textStyle}>
              Estación más cercana:
            </Typography>
            <Typography>
              Apeadero de Adarzo (12 min andando)
            </Typography>
          </>
        );

      case "coche":
        return (
          <>
            <Typography sx={textStyle}>
              Accesos principales:
            </Typography>
            <ul>
              <li>S-10 → N-623 / Hospital</li>
              <li>S-20 → salida 2 (La Albericia / Cazoña)</li>
              <li>A-67 → salida 199B (Cuatro Caminos)</li>
            </ul>
          </>
        );

      case "info":
        return (
          <Typography>
            Conexión con Torrelavega y otros puntos mediante autobuses ALSA.
          </Typography>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ width: "100vw", overflowX: "hidden" }}>
      

      {/* HERO */}
      <Box sx={heroStyle}>
        <Typography variant="h3" sx={{ color: "var(--gold)", mb: 1 }}>
          Cómo llegar
        </Typography>

        <Typography variant="h6">
          J13PRO Training Center
        </Typography>

        <Typography sx={{ mt: 1 }}>
          C. el Castro, 24I, nave 9, Santander
        </Typography>

        {/* BOTONES */}
        <Box sx={{ mt: 3, display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
          
          <Button
            variant="contained"
            sx={ctaStyle}
            component="a"
            target="_blank"
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination)}`}
          >
            Abrir en Google Maps
          </Button>

          <Button
            variant="outlined"
            onClick={getUserLocation}
            sx={{
              borderColor: "var(--gold)",
              color: "var(--gold)",
              fontWeight: "bold",
              "&:hover": {
                borderColor: "var(--orange)",
                color: "var(--orange)",
              },
            }}
          >
            Cómo llegar desde mi ubicación
          </Button>

        </Box>
      </Box>

      {/* SELECTOR */}
      <Box sx={selectorContainer}>
        <Button onClick={() => setTab("bus")} sx={tabStyle(tab === "bus")}>
          <DirectionsBusIcon /> Bus
        </Button>

        <Button onClick={() => setTab("tren")} sx={tabStyle(tab === "tren")}>
          <TrainIcon /> Tren
        </Button>

        <Button onClick={() => setTab("coche")} sx={tabStyle(tab === "coche")}>
          <DirectionsCarIcon /> Coche
        </Button>

        <Button onClick={() => setTab("info")} sx={tabStyle(tab === "info")}>
          <InfoIcon /> Info
        </Button>
      </Box>

      {/* CONTENIDO */}
      <Box sx={contentWrapper}>
        <Paper sx={cardStyle}>
          {renderContent()}
        </Paper>
      </Box>

      
    </Box>
  );
}

/* 🎨 ESTILOS */

const heroStyle = {
  textAlign: "center",
  py: 6,
  px: 2,
  background: "linear-gradient(180deg, #000, #111)",
  color: "white",
};

const ctaStyle = {
  backgroundColor: "var(--orange)",
  fontWeight: "bold",
};

const selectorContainer = {
  display: "flex",
  justifyContent: "center",
  gap: 2,
  flexWrap: "wrap",
  mt: 4,
};

const tabStyle = (active: boolean) => ({
  display: "flex",
  gap: 1,
  alignItems: "center",
  borderRadius: 3,
  px: 2,
  py: 1,
  backgroundColor: active ? "var(--gold)" : "#111",
  color: active ? "#000" : "var(--white)",
  border: "1px solid rgba(255,215,0,0.3)",
  transition: "all 0.3s",
  "&:hover": {
    backgroundColor: "var(--orange)",
    color: "#fff",
  },
});

const contentWrapper = {
  maxWidth: 800,
  mx: "auto",
  px: 2,
  py: 5,
};

const cardStyle = {
  background: "linear-gradient(145deg, #111, #1a1a1a)",
  color: "white",
  padding: 3,
  borderRadius: 3,
  border: "1px solid rgba(255, 215, 0, 0.15)",
  boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
};

const textStyle = {
  opacity: 0.9,
  mb: 1,
};