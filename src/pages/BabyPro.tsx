import { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { supabase } from "../api/supabaseClient";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Carousel from "../components/Carousel";

export default function BabyPro() {
  const [content, setContent] = useState("");
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // 📄 CONTENIDO (pages)
      const { data: page, error: pageError } = await supabase
        .from("pages")
        .select("*")
        .eq("slug", "baby-pro")
        .single();

      if (pageError) {
        console.error(pageError);
        setError("Error cargando contenido");
      } else {
        setContent(page?.content || "");
      }

      // 🖼 MEDIA (imagenes / videos)
      const { data: mediaData, error: mediaError } = await supabase
        .from("page_media")
        .select("*")
        .eq("page_slug", "baby-pro")
        .order("order_index");

      if (mediaError) {
        console.error(mediaError);
      } else {
        setMedia(mediaData || []);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ width: "100vw", overflowX: "hidden" }}>
      <Header />

      <Carousel pageSlug="baby-pro" />

      {/* 📄 CONTENIDO */}
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
          mt: 4,
          mb: 6,
        }}
      >
        {loading ? (
          <Typography>Cargando...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          (() => {
            const lines = content.split("\n");
            const firstLine = lines.shift();
            const rest = lines.join("\n");

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
          })()
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