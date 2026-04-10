import { useEffect, useState } from "react";
import { supabase } from "../api/supabaseClient";
import {
  Box,
  Tabs,
  Tab,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  FormControlLabel,
  MenuItem,
} from "@mui/material";

import Header from "../components/Header";
import AdminPageEditor from "./AdminPageEditor";
import AdminCarouselUpload from "./AdminCarouselUpload";

interface Page {
  id: string;
  slug: string;
  title: string;
  is_nav_group: boolean;
  parent_slug: string | null;
}
const generateSlug = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");

const AdminPanel: React.FC = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [activeSlug, setActiveSlug] = useState<string>("carousel");

  // CREATE PAGE
  const [openCreate, setOpenCreate] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");

  const [isNavGroup, setIsNavGroup] = useState(false);
  const [parent, setParent] = useState<string | null>(null);

  // ---------------------------
  // LOAD PAGES
  // ---------------------------
  const fetchPages = async () => {
    const { data, error } = await supabase
      .from("pages")
      .select("id, slug, title, is_nav_group, parent_slug")
      .order("title", { ascending: true });

    if (error) {
      console.error(error);
      return;
    }

    setPages(data || []);
  };

  useEffect(() => {
    fetchPages();
  }, []);

  // ---------------------------
  // CREATE PAGE
  // ---------------------------
  const createPage = async () => {
    if (!newSlug || !newTitle) return;

    const { error } = await supabase.from("pages").insert({
      title: newTitle,
      slug: newSlug,
      content: isNavGroup ? null : "",
      is_nav_group: isNavGroup,
      parent_slug: parent,
    });

    if (error) {
      console.error(error);
      return;
    }

    setOpenCreate(false);
    setNewTitle("");
    setNewSlug("");
    setIsNavGroup(false);
    setParent(null);

    await fetchPages();
    setActiveSlug(newSlug);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fff", p: 4 }}>
      <Header />

      <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 3 }}>

        {/* HEADER ACTIONS */}
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h5">Admin Panel</Typography>

          <Button variant="contained" onClick={() => setOpenCreate(true)}>
            + Nueva página
          </Button>
        </Box>

        {/* TABS */}
        <Paper sx={{ borderRadius: 2 }}>
          <Tabs
            value={activeSlug}
            onChange={(_, value) => setActiveSlug(value)}
            variant="scrollable"
            scrollButtons="auto"
          >
            {/* FIJO */}
            <Tab value="carousel" label="Carrusel Inicio" />

            {/* SOLO PÁGINAS REALES (NO NAV GROUPS) */}
            {pages
              .filter((p) => !p.is_nav_group)
              .map((page) => (
                <Tab
                  key={page.id}
                  value={page.slug}
                  label={page.title || page.slug}
                />
              ))}
          </Tabs>
        </Paper>

        {/* CONTENT */}
        <Box>
          {activeSlug === "carousel" ? (
            <AdminCarouselUpload />
          ) : activeSlug ? (
            <AdminPageEditor slug={activeSlug} />
          ) : (
            <Typography>Cargando...</Typography>
          )}
        </Box>
      </Box>

      {/* CREATE PAGE MODAL */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)}>
        <DialogTitle>Crear nueva página</DialogTitle>

        <DialogContent>
          {/* TITULO */}
          <TextField
            fullWidth
            label="Título"
            value={newTitle}
           onChange={(e) => {
  const value = e.target.value;
  setNewTitle(value);

  // solo auto-actualiza slug si todavía no lo ha tocado
  if (!newSlug || newSlug === generateSlug(newTitle)) {
    setNewSlug(generateSlug(value));
  }
}}
          sx={{
  mt: 2,
  backgroundColor: "#fff",
  borderRadius: 1,
}}
          />


          {/* NAV GROUP */}
          <FormControlLabel
            sx={{ mt: 2 }}
            control={
              <Checkbox
                checked={isNavGroup}
                onChange={(e) => {
                  setIsNavGroup(e.target.checked);
                  if (e.target.checked) setParent(null);
                }}
              />
            }
            label="Es grupo de navegación (no tiene contenido)"
          />

          {/* PARENT SELECT */}
          {!isNavGroup && (
           <TextField
  select
  fullWidth
  label="Página padre (opcional)"
  value={parent || ""}
  onChange={(e) => setParent(e.target.value || null)}
  sx={{
    mt: 2,
    backgroundColor: "#fff",
    borderRadius: 1,
  }}
>
  <MenuItem value="">Ninguna (principal)</MenuItem>

  {pages
    .filter((p) => p.is_nav_group)
    .map((p) => (
      <MenuItem key={p.slug} value={p.slug}>
        {p.title}
      </MenuItem>
    ))}
</TextField>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenCreate(false)}>Cancelar</Button>

          <Button variant="contained" onClick={createPage}>
            Crear
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminPanel;