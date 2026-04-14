import { Box, Typography } from "@mui/material";
export default function Legal() {
  return (
    <Box sx={{ width: "100vw", overflowX: "hidden" }}>
      

      <Box
        sx={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: 4,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Aviso Legal y Condiciones Generales de Uso
        </Typography>

        <Typography variant="body2" gutterBottom>
          https://j13pro.es
        </Typography>

        {/* SECCIÓN I */}
        <Typography variant="h6" mt={3}>
          I. INFORMACIÓN GENERAL
        </Typography>

        <Typography >
          En cumplimiento con el deber de información dispuesto en la Ley 34/2002...
        </Typography>

        <Typography >
          La titularidad de este sitio web la ostenta: Juan Arnaiz, con NIF: 72051959C
        </Typography>

        <Typography >
          Dirección: Calle el castro 24-i
        </Typography>

        <Typography >
          Teléfono: 665691927
        </Typography>

        <Typography >
          Email: inscripciones@j13pro.es
        </Typography>

        {/* SECCIÓN II */}
        <Typography variant="h6" mt={3}>
          II. TÉRMINOS Y CONDICIONES GENERALES DE USO
        </Typography>

        <Typography >
          El objeto de las presentes Condiciones Generales de Uso es regular el acceso...
        </Typography>

        {/* 👇 IMPORTANTE: puedes seguir copiando el texto tal cual */}
        <Typography >
          J13PRO se reserva la facultad de modificar...
        </Typography>

        <Typography >
          El acceso al Sitio Web por el Usuario tiene carácter libre...
        </Typography>

        {/* SECCIÓN III */}
        <Typography variant="h6" mt={3}>
          III. ACCESO Y NAVEGACIÓN EN EL SITIO WEB
        </Typography>

        <Typography >
          J13PRO no garantiza la continuidad, disponibilidad y utilidad del Sitio Web...
        </Typography>

        {/* SECCIÓN IV */}
        <Typography variant="h6" mt={3}>
          IV. POLÍTICA DE ENLACES
        </Typography>

        <Typography >
          Se informa que el Sitio Web puede contener enlaces a terceros...
        </Typography>

        {/* SECCIÓN V */}
        <Typography variant="h6" mt={3}>
          V. PROPIEDAD INTELECTUAL E INDUSTRIAL
        </Typography>

        <Typography >
          J13PRO es titular de todos los derechos...
        </Typography>

        {/* SECCIÓN VI */}
        <Typography variant="h6" mt={3}>
          VI. ACCIONES LEGALES
        </Typography>

        <Typography>
          La relación entre el Usuario y J13PRO se regirá por la normativa vigente en España...
        </Typography>
      </Box>

      
    </Box>
  );
}