import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Drawer,
  List,
  ListItemText,
  ListItemButton,
  Collapse,
  Box,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import { Link } from "react-router-dom";
import logo from '../assets/logo.png';
import sinfondo from '../assets/sinfondo.png';



export default function Header() {
  const [open, setOpen] = useState(false);
  const [openModalidades, setOpenModalidades] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  return (
    <>
      <AppBar position="sticky" sx={{ background: "#000", width:"100%" }}>
        <Toolbar>
         <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", gap: 1 }}>
    <img
      src={logo}
      alt="J13Pro Logo"
      style={{ width: 50, height: 50, borderRadius: "50%" }}
    />

    <img
 src={sinfondo}
  alt="J13Pro Texto"
  style={{
    height: 40,
    filter: "drop-shadow(2px 2px 2px rgba(255, 215, 0, 0.8))",
  }}
/>
  </Box>

          {/* DESKTOP */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
            <Button color="inherit" component={Link} to="/">Inicio</Button>
            <Button color="inherit" component={Link} to="/admin">Admin</Button>
            <Button color="inherit" component={Link} to="/contacto">Contáctanos</Button>
            <Button color="inherit" component={Link} to="/alquiler">Alquiler</Button>

            {/* MODALIDADES DESKTOP */}
            <Button color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
              Modalidades
            </Button>
            <Menu anchorEl={anchorEl} open={openMenu} onClose={() => setAnchorEl(null)}>
              <MenuItem component={Link} to="/baby">Baby Pro</MenuItem>
              <MenuItem component={Link} to="/campus">Campus</MenuItem>
              <MenuItem component={Link} to="/j13proone">J13ProOne</MenuItem>
              <MenuItem component={Link} to="/pachangas">Pachangas</MenuItem>
              <MenuItem component={Link} to="/cumples">Cumpleaños</MenuItem>
            </Menu>

            <Button color="inherit" component={Link} to="/patrocinadores">Patrocinadores</Button>
            <Button color="inherit" component={Link} to="/como-llegar">Cómo llegar</Button>
          </Box>

          {/* MOBILE */}
          <IconButton
            color="inherit"
            edge="end"
            sx={{ display: { xs: "block", md: "none" } }}
            onClick={() => setOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* DRAWER MOBILE */}
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: { xs: '80vw', sm: 250 } }}>
        <List sx={{ width: 250 }}>
          <ListItemButton component={Link} to="/">
            <ListItemText primary="Inicio" />
          </ListItemButton>
            <ListItemButton component={Link} to="/admin">
            <ListItemText primary="Admin" />
          </ListItemButton>
          <ListItemButton component={Link} to="/contacto">
            <ListItemText primary="Contáctanos" />
          </ListItemButton>
          <ListItemButton component={Link} to="/alquiler">
            <ListItemText primary="Alquiler" />
          </ListItemButton>

          {/* Acordeón Modalidades */}
          <ListItemButton onClick={() => setOpenModalidades(!openModalidades)}>
            <ListItemText primary="Modalidades" />
            {openModalidades ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>

          <Collapse in={openModalidades} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }} component={Link} to="/baby">
                <ListItemText primary="Baby Pro" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }} component={Link} to="/campus">
                <ListItemText primary="Campus" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }} component={Link} to="/j13proone">
                <ListItemText primary="J13ProOne" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }} component={Link} to="/pachangas">
                <ListItemText primary="Pachangas" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }} component={Link} to="/cumples">
                <ListItemText primary="Cumpleaños" />
              </ListItemButton>
            </List>
          </Collapse>

          <ListItemButton component={Link} to="/patrocinadores">
            <ListItemText primary="Patrocinadores" />
          </ListItemButton>
          <ListItemButton component={Link} to="/como-llegar">
            <ListItemText primary="Cómo llegar" />
          </ListItemButton>
        </List>
        </Box>
      </Drawer>
    </>
  );
}