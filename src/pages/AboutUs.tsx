import { Box, Typography } from "@mui/material";
import { supabase } from "../api/supabaseClient";
import { useEffect, useState } from "react";

const ABOUT_ID =
  "00000000-0000-0000-0000-000000000001";

export default function AboutUs() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from("about_us")
        .select("*")
        .eq("id", ABOUT_ID)
        .single();

      if (data) setData(data);
    };

    fetchData();
  }, []);

  if (!data) return null;

  return (
    <Box sx={{ width: "100vw", overflowX: "hidden" }}>

      {/* HERO (sustituye al carrusel) */}
      <Box
        sx={{
          width: "100%",
          height: {
            xs: 350,
            md: 500,
          },
          position: "relative",
          overflow: "hidden",
          backgroundColor: "black",
        }}
      >
        <img
          src={data.main_image_url}
          alt="about hero"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* overlay estilo carrusel */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7))",
          }}
        />
      </Box>

      {/* CONTENIDO */}
      <Box
        sx={{
          maxWidth: 1000,
          mx: "auto",
          p: 6,
          backgroundColor: "rgba(0,0,0,0.9)",
          color: "white",
          borderRadius: 2,
          mt: 4,
          mb: 6,
        }}
      >

        {/* BLOQUE 1 - INSTALACIONES */}
        <Box sx={{ mb: 6 }}>
          <Typography>
            {data.instalaciones_text}
          </Typography>
        </Box>

        {/* BLOQUE 2 - OWNER */}
        <Box
          sx={{
            display: "flex",
            gap: 4,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >

          {/* IMAGEN OWNER */}
          <Box
            component="img"
            src={data.owner_image_url}
            sx={{
              width: 280,
              borderRadius: 2,
              flexShrink: 0,
            }}
          />

          {/* TEXTO OWNER */}
          <Typography sx={{ flex: 1 }}>
            {data.owner_text}
          </Typography>

        </Box>

      </Box>
    </Box>
  );
}