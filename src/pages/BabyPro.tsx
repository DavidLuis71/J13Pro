import { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { supabase } from "../api/supabaseClient";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function BabyPro() {
  const [content, setContent] = useState("");
  const [videoURL, setVideoURL] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔹 Cargar datos de Supabase
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("baby_pro")
        .select("*")
        .single();

      if (error) {
        console.error(error);
        setError("Error cargando datos de Baby Pro");
      } else {
        setContent(data?.content || "");
        setVideoURL(data?.video_url || "");
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  // 🔹 Render
  return (
    <Box sx={{ width: "100vw", overflowX: "hidden" }}>
      <Header />

      {/* VIDEO */}
      {videoURL && (
        <Box sx={{ width: "100%" }}>
          <video
            src={videoURL}
            controls
            autoPlay
            muted
            loop
            style={{
              width: "100%",
              maxHeight: "400px",
              objectFit: "cover",
            }}
          />
        </Box>
      )}

      {/* CONTENIDO */}
      {/* CONTENIDO */}
<Box
  sx={{
    maxWidth: 900,
    mx: "auto",
    p: 6,
    backgroundColor: "rgba(0,0,0,0.9)",
    color: "white",
    borderRadius: 2,
    boxShadow: "0 8px 25px rgba(0,0,0,0.4)",
    lineHeight: 1.7,
    mb: 6,
  }}
>
  {loading ? (
    <Typography>Cargando...</Typography>
  ) : error ? (
    <Typography color="error">{error}</Typography>
  ) : (
    <>
      {(() => {
        const lines = content.split("\n"); // Separar por saltos de línea
        const firstLine = lines.shift();   // Sacar la primera línea
        const rest = lines.join("\n");     // El resto del contenido

        return (
          <>
            {firstLine && (
              <Typography
                sx={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  mb: 2,
                  lineHeight: 1.3,
                  color: "var(--orange)",
                }}
              >
                {firstLine}
              </Typography>
            )}

            {rest && (
              <Typography sx={{ whiteSpace: "pre-line", fontSize: "1.1rem" }}>
                {rest}
              </Typography>
            )}
          </>
        );
      })()}
    </>
  )}
</Box>
      {/* CTA */}
      <Box
        sx={{
          textAlign: "center",
          py: 6,
          backgroundColor: "#111",
          color: "white",
        }}
      >
        <Typography variant="h5">¿Estás list@?</Typography>
        <Typography variant="h6" sx={{ mb: 2 }}>
          ¡Vamos a por todas!
        </Typography>
        <Typography sx={{ mb: 3 }}>
          Déjanos tus datos y te llamaremos a la mayor brevedad posible
        </Typography>

        <Button variant="contained" color="primary">
          CONTACTA
        </Button>
      </Box>

      <Footer />
    </Box>
  );
}