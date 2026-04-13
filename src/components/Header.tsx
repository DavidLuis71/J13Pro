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

import { useEffect, useMemo, useState } from "react";
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

const staticPages = [
  { label: "Admin", path: "/admin" },
  { label: "Contáctanos", path: "/contacto" },
  { label: "Alquiler", path: "/alquiler" },
  { label: "Galeria", path: "/galery" },
  { label: "Patrocinadores", path: "/patrocinadores" },
  { label: "Cómo llegar", path: "/direction" },
];

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  // DESKTOP MENU STATE
  const [desktopMenuSlug, setDesktopMenuSlug] = useState<string | null>(null);
  const [desktopAnchor, setDesktopAnchor] = useState<HTMLElement | null>(null);

  // MOBILE MENU STATE
  const [mobileMenuSlug, setMobileMenuSlug] = useState<string | null>(null);

  const [pages, setPages] = useState<Page[]>([]);

  // ---------------- FETCH PAGES ----------------
  useEffect(() => {
    const fetchPages = async () => {
      const { data, error } = await supabase
        .from("pages")
        .select("id, slug, title, is_nav_group, parent_slug");

      if (error) {
        console.error(error);
        return;
      }

      setPages(data || []);
    };

    fetchPages();
  }, []);

  // ---------------- DERIVED DATA ----------------
  const { navGroups, mainPages, childrenMap } = useMemo(() => {
    const navGroups = pages.filter((p) => p.is_nav_group);

    const mainPages = pages.filter(
      (p) => !p.is_nav_group && !p.parent_slug
    );

    const childrenMap = pages.reduce((acc, p) => {
      if (!p.parent_slug) return acc;
      if (!acc[p.parent_slug]) acc[p.parent_slug] = [];
      acc[p.parent_slug].push(p);
      return acc;
    }, {} as Record<string, Page[]>);

    return { navGroups, mainPages, childrenMap };
  }, [pages]);

  return (
    <>
      <AppBar position="sticky" sx={{ background: "#000" }}>
        <Toolbar>
          {/* LOGO */}
          <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", gap: 1 }}>
            <img
              src={logo}
              alt="Logo"
              style={{ width: 50, height: 50, borderRadius: "50%" }}
            />
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
            <Button component={Link} to="/" color="inherit">
              Inicio
            </Button>

            {mainPages.map((page) => (
              <Button
                key={page.slug}
                component={Link}
                to={`/${page.slug}`}
                color="inherit"
              >
                {page.title}
              </Button>
            ))}

            {navGroups.map((group) => {
              const children = childrenMap[group.slug] || [];
              if (children.length === 0) return null;

              return (
                <div key={group.slug}>
                  <Button
                    color="inherit"
                    onClick={(e) => {
                      setDesktopAnchor(e.currentTarget);
                      setDesktopMenuSlug(group.slug);
                    }}
                  >
                    {group.title}
                  </Button>

                  <Menu
                    anchorEl={desktopAnchor}
                    open={desktopMenuSlug === group.slug}
                    onClose={() => {
                      setDesktopAnchor(null);
                      setDesktopMenuSlug(null);
                    }}
                  >
                    {children.map((p) => (
                      <MenuItem
                        key={p.slug}
                        component={Link}
                        to={`/${p.slug}`}
                        onClick={() => {
                          setDesktopAnchor(null);
                          setDesktopMenuSlug(null);
                        }}
                      >
                        {p.title}
                      </MenuItem>
                    ))}
                  </Menu>
                </div>
              );
            })}

            {staticPages.map((p) => (
              <Button
                key={p.path}
                component={Link}
                to={p.path}
                color="inherit"
              >
                {p.label}
              </Button>
            ))}
          </Box>

          {/* ---------------- MOBILE BUTTON ---------------- */}
          <IconButton
            color="inherit"
            edge="end"
            sx={{ display: { xs: "block", md: "none" } }}
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon sx={{ color: "var(--gold)" }} />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* ---------------- MOBILE DRAWER ---------------- */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setMobileMenuSlug(null);
        }}
        slotProps={{
    paper: {
      sx: {
        width: 160,
        maxWidth: "50vw",
        backgroundColor: "var(--black-text-bg)",
        color: "var(--gold)",
       
      },
    },
  }}
       
      >
        <Box sx={{ width: 160, maxWidth: "70vw"}}>
          <List>
            <ListItemButton
              component={Link}
              to="/"
              onClick={() => setDrawerOpen(false)}
            >
              <ListItemText primary="Inicio" />
            </ListItemButton>

            {mainPages.map((page) => (
              <ListItemButton
                key={page.slug}
                component={Link}
                to={`/${page.slug}`}
                onClick={() => setDrawerOpen(false)}
              >
                <ListItemText primary={page.title} />
              </ListItemButton>
            ))}

            {navGroups.map((group) => {
              const isOpen = mobileMenuSlug === group.slug;
              const children = childrenMap[group.slug] || [];

              if (children.length === 0) return null;

              return (
                <div key={group.slug}>
                  <ListItemButton
                    onClick={() =>
                      setMobileMenuSlug(isOpen ? null : group.slug)
                    }
                    
                  >
                    <ListItemText primary={group.title} />
                 {isOpen ? (
  <ExpandLess sx={{ color: "var(--gold)" }} />
) : (
  <ExpandMore sx={{ color: "var(--gold)" }} />
)}
                  </ListItemButton>

                  <Collapse in={isOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {children.map((p) => (
                        <ListItemButton
                          key={p.slug}
                          sx={{ pl: 4 }}
                          component={Link}
                          to={`/${p.slug}`}
                          onClick={() => {
                            setDrawerOpen(false);
                            setMobileMenuSlug(null);
                          }}
                        >
                          <ListItemText primary={p.title} />
                        </ListItemButton>
                      ))}
                    </List>
                  </Collapse>
                </div>
              );
            })}

            {staticPages.map((p) => (
              <ListItemButton
                key={p.path}
                component={Link}
                to={p.path}
                onClick={() => setDrawerOpen(false)}
              >
                <ListItemText primary={p.label} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}