import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { supabase } from "../api/supabaseClient";
import Carousel from "../components/Carousel";

export default function PageRenderer() {
  const { slug } = useParams();

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPage = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("pages")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) {
        setError("Página no encontrada");
        setLoading(false);
        return;
      }

      setContent(data?.content || "");
      setLoading(false);
    };

    if (slug) fetchPage();
  }, [slug]);

  return (
    <Box sx={{ width: "100vw", overflowX: "hidden" }}>
      

      {/* Carrusel dinámico */}
      {slug && <Carousel pageSlug={slug} />}

      {/* CONTENIDO */}
      <Box
        sx={{
          maxWidth: 900,
          mx: "auto",
          p: 6,
          backgroundColor: "rgba(0,0,0,0.9)",
          color: "white",
          borderRadius: 2,
          mt: 4,
          mb: 6,
        }}
      >
        {loading ? (
          <Typography>Cargando...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          content.split("\n").map((line, i) => (
            <Typography key={i} sx={{ mb: 1 }}>
              {line}
            </Typography>
          ))
        )}
      </Box>

      
    </Box>
  );
}