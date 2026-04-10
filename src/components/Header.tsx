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

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { supabase } from "../api/supabaseClient";

import logo from "../assets/logo.png";
import sinfondo from "../assets/sinfondo.png";

interface Page {
  id: string;
  slug: string;
  title: string;
  is_nav_group: boolean;
  parent_slug: string | null;
}

export default function Header() {
  const [open, setOpen] = useState(false);

  const [openMenuSlug, setOpenMenuSlug] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [pages, setPages] = useState<Page[]>([]);

  const openMenu = Boolean(anchorEl);

  // -----------------------
  // FETCH CMS PAGES
  // -----------------------
  useEffect(() => {
    const fetchPages = async () => {
      const { data } = await supabase
        .from("pages")
        .select("id, slug, title, is_nav_group, parent_slug");

      if (data) setPages(data);
    };

    fetchPages();
  }, []);

  // 🔥 PADRES
  const navGroups = pages.filter((p) => p.is_nav_group);

  return (
    <>
      <AppBar position="sticky" sx={{ background: "#000", width: "100%" }}>
        <Toolbar>
          {/* LOGO */}
          <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", gap: 1 }}>
            <img src={logo} alt="Logo" style={{ width: 50, height: 50, borderRadius: "50%" }} />
            <img
              src={sinfondo}
              alt="Texto"
              style={{
                height: 40,
                filter: "drop-shadow(2px 2px 2px rgba(255, 215, 0, 0.8))",
              }}
            />
          </Box>

          {/* ---------------- DESKTOP ---------------- */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
            <Button color="inherit" component={Link} to="/">
              Inicio
            </Button>

            <Button color="inherit" component={Link} to="/admin">
              Admin
            </Button>

            <Button color="inherit" component={Link} to="/contacto">
              Contáctanos
            </Button>

            <Button color="inherit" component={Link} to="/alquiler">
              Alquiler
            </Button>

            {/* NAV GROUPS */}
            {navGroups.map((group) => {
              const children = pages.filter(
                (p) => p.parent_slug === group.slug
              );

              return (
                <div key={group.slug}>
                  <Button
                    color="inherit"
                    onClick={(e) => {
                      setAnchorEl(e.currentTarget);
                      setOpenMenuSlug(group.slug);
                    }}
                  >
                    {group.title}
                  </Button>

                  {/* DROPDOWN SOLO PARA ESTE GRUPO */}
                  <Menu
                    anchorEl={anchorEl}
                    open={openMenu && openMenuSlug === group.slug}
                    onClose={() => {
                      setAnchorEl(null);
                      setOpenMenuSlug(null);
                    }}
                  >
                    {children.map((p) => (
                      <MenuItem
                        key={p.slug}
                        component={Link}
                        to={`/${p.slug}`}
                        onClick={() => {
                          setAnchorEl(null);
                          setOpenMenuSlug(null);
                        }}
                      >
                        {p.title}
                      </MenuItem>
                    ))}
                  </Menu>
                </div>
              );
            })}

            <Button color="inherit" component={Link} to="/patrocinadores">
              Patrocinadores
            </Button>

            <Button color="inherit" component={Link} to="/como-llegar">
              Cómo llegar
            </Button>
          </Box>

          {/* ---------------- MOBILE ---------------- */}
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

      {/* ---------------- DRAWER MOBILE ---------------- */}
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: { xs: "80vw", sm: 250 } }}>
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

            {/* NAV GROUPS MOBILE (FIX REAL) */}
            {navGroups.map((group) => {
              const isOpen = openMenuSlug === group.slug;

              const children = pages.filter(
                (p) => p.parent_slug === group.slug
              );

              return (
                <div key={group.slug}>
                  <ListItemButton
                    onClick={() =>
                      setOpenMenuSlug(isOpen ? null : group.slug)
                    }
                  >
                    <ListItemText primary={group.title} />
                    {isOpen ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>

                  <Collapse in={isOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {children.map((p) => (
                        <ListItemButton
                          key={p.slug}
                          sx={{ pl: 4 }}
                          component={Link}
                          to={`/${p.slug}`}
                          onClick={() => setOpen(false)}
                        >
                          <ListItemText primary={p.title} />
                        </ListItemButton>
                      ))}
                    </List>
                  </Collapse>
                </div>
              );
            })}

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