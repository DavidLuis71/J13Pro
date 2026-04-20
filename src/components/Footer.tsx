import { Box, Typography, IconButton } from "@mui/material";
import { FaInstagram, FaTwitter, FaTiktok } from "react-icons/fa";

export default function Footer() {
  return (
    <Box sx={{ background: "#000", color: "#fff", mt: 4 }}>
      
      {/* Redes sociales */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 3,
          py: 2,
        }}
      >
        <IconButton
          component="a"
          href="https://www.tiktok.com/@j13pro_"
          target="_blank"
          sx={{ color: "#fff", fontSize: 30 }}
        >
          <FaTiktok />
        </IconButton>
        <IconButton
          component="a"
          href="https://www.instagram.com/j13pro_/"
          target="_blank"
          sx={{ color: "#E1306C", fontSize: 30 }}
        >
          <FaInstagram />
        </IconButton>
      </Box>

      {/* Texto legal */}
      <Box sx={{ textAlign: "center", pb: 2 }}>
        <Typography variant="body2">
          © {new Date().getFullYear()} J13 PRO | Todos los derechos reservados |{" "}
          <a
            href="/legal"
            style={{ color: "#d4af37", textDecoration: "none" }}
          >
            Aviso Legal
          </a>
        </Typography>
      </Box>
    </Box>
  );
}