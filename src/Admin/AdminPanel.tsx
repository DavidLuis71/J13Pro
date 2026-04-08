import { useState } from "react";
import { Box,  Typography,  Tabs, Tab, Paper } from "@mui/material";
import AdminCarouselUpload from "./AdminCarouselUpload"; 
import Header from "../components/Header";
import AdminBabyPro from "./AdminBabyPro";

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box
  sx={{
    minHeight: "100vh",
    backgroundColor: "#ffffff", // fondo sólido oscuro
    color: "white",
    padding: 4,
  }}
>
    <Header />
    <Box sx={{ display: "flex", flexDirection: "column", padding: 4, gap: 4 }}>
        
        <Paper sx={{ borderRadius: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Carrusel Inicio" />
          <Tab label="Contactanos" />
          <Tab label="Alquiler" />
          <Tab label="Baby Pro" />
          <Tab label="Campus" />
          <Tab label="J13ProOne" />
          <Tab label="Pachangas" />
          <Tab label="Cumpleaños" />
          <Tab label="Patrocinadores" />
          <Tab label="Como llegar" />
        </Tabs>
      </Paper>

      <Box sx={{ marginTop: 3 }}>
        {activeTab === 0 && <AdminCarouselUpload />}
        {activeTab === 1 && <Typography>Aquí podrás modificar Contactanos</Typography>}
        {activeTab === 2 && <Typography>Aquí podrás modificar Alquiler</Typography>}
        {activeTab === 3 && <AdminBabyPro />}
         {activeTab === 4 && <Typography>Aquí podrás modificar los campus</Typography>}
        {activeTab === 5 && <Typography>Aquí podrás modificar j13 ProOne</Typography>}
        {activeTab === 6 && <Typography>Aquí podrás modificar pachangas</Typography>}
         {activeTab === 7 && <Typography>Aquí podrás modificar los cumpleaños</Typography>}
        {activeTab === 8 && <Typography>Aquí podrás modificar patrocinadores</Typography>}
        {activeTab === 9 && <Typography>Aquí podrás modificar como legar</Typography>}
      </Box>
    </Box>
    </Box>
  );
};

export default AdminPanel;