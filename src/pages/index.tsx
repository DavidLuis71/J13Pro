import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import { useState } from "react";
import Header from "../components/Header";
import Carousel from "./Carousel";
import Footer from "../components/Footer";

export default function Index() {
  const [openModal, setOpenModal] = useState(true); // Modal abierto al cargar

  return (
  <Box sx={{ width: '100vw', overflowX: 'hidden' }}>
      <Header />
<Carousel />
      {/* MODAL RESPONSIVE */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        sx={{
    
            width: '90vw',       // ancho máximo 90% del viewport
            maxWidth: '400px',   // no más ancho que 400px
            maxHeight: '80vh',   // no más alto que 80% de la pantalla
            overflowY: 'auto',   // scroll interno si el contenido es muy largo
            mx: 'auto',          // centrar horizontalmente
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
            color="primary"
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

      {/* FOOTER */}
     <Footer/>
    </Box>
  );
}