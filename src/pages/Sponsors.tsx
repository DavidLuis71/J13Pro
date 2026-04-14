import { useEffect, useState } from "react";
import { supabase } from "../api/supabaseClient";
import { Box, Typography, Card, CardMedia, CardContent } from "@mui/material";

export default function Sponsors() {
  const [sponsors, setSponsors] = useState([]);

  // 🔄 FETCH desde Supabase
  const fetchSponsors = async () => {
    const { data, error } = await supabase
      .from("sponsors")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error cargando sponsors:", error);
      return;
    }

    setSponsors(data || []);
  };

  useEffect(() => {
    fetchSponsors();
  }, []);

  return (
    <Box sx={{ py: 6, px: 2, backgroundColor: "#0f0f0f", textAlign: "center" }}>
      
      {/* TÍTULO */}
      <Typography variant="h4" sx={{ color: "var(--gold)", mb: 3 }}>
        Patrocinadores
      </Typography>

      {/* LISTA */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 3,
        }}
      >
        {sponsors.map((sponsor) => (
          <Card
            key={sponsor.id}
            component="a"
            href={sponsor.website || "#"}
            target="_blank"
            sx={{
              width: 160,
              backgroundColor: "#111",
              color: "white",
              textDecoration: "none",
              transition: "0.3s",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0 0 15px rgba(255, 215, 0, 0.4)",
              },
            }}
          >
            {/* LOGO */}
            <CardMedia
              component="img"
              image={sponsor.image_url}
              alt={sponsor.name}
              sx={{
                height: 100,
                objectFit: "contain",
                p: 2,
                backgroundColor: "white",
              }}
            />

            {/* TEXTO */}
            <CardContent>
              <Typography variant="body1">{sponsor.name}</Typography>

              {sponsor.description && (
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                  {sponsor.description}
                </Typography>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}