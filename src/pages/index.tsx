import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import { useState } from "react";
import Header from "../components/Header";
import Carousel from "./Carousel";
import Footer from "../components/Footer";
import StarIcon from "@mui/icons-material/Star";

export default function Index() {
  const [openModal, setOpenModal] = useState(true);

  return (
    <Box sx={{ width: '100vw', overflowX: 'hidden' }}>
      <Header />
      <Carousel />

      {/* MODAL */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        sx={{
          width: '90vw',
          maxWidth: '400px',
          maxHeight: '80vh',
          overflowY: 'auto',
          mx: 'auto',
          borderRadius: 2
        }}
      >
        <DialogTitle>¡Información Actualizada!</DialogTitle>
        <DialogContent>
          <Typography>
            Toda la información actualizada sobre J13PRO la encontrarás en nuestro perfil de Instagram.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cerrar</Button>
          <Button
            component="a"
            href="https://www.instagram.com/j13pro_/"
            target="_blank"
            variant="contained"
          >
            Ir a Instagram
          </Button>
        </DialogActions>
      </Dialog>

      {/* SERVICIOS */}
      <section className="services">
        <div className="card">
          <h3>Preparación Física + Pista</h3>
        </div>

        <div className="card">
          <h3>Entrenamiento Individual</h3>
        </div>
      </section>

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

      {/* ⭐ RESEÑAS (NUEVO BLOQUE PRO) */}
      <Box
        sx={{
          textAlign: "center",
          py: 5,
          px: 2,
          background: "linear-gradient(180deg, #111, #000)",
          color: "white",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
          {[...Array(5)].map((_, i) => (
            <StarIcon key={i} sx={{ color: "var(--gold)", fontSize: 28 }} />
          ))}
        </Box>

        <Typography variant="h5" sx={{ color: "var(--gold)", mb: 1 }}>
          ¿Te ha gustado la experiencia?
        </Typography>

        <Typography sx={{ mb: 2 }}>
          Tu opinión nos ayuda a seguir creciendo 🚀
        </Typography>

        <Button
          variant="contained"
          component="a"
          href="https://g.page/r/Ccos0LgLSRUuEBM/review"
          target="_blank"
          sx={{
            backgroundColor: "var(--orange)",
            fontWeight: "bold",
            px: 4,
            py: 1.2,
            borderRadius: 3,
            "&:hover": {
              backgroundColor: "var(--gold)",
              color: "#000",
            },
          }}
        >
          Puntuanos
        </Button>
      </Box>

      <Footer />
    </Box>
  );
}