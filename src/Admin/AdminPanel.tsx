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

  const [openDelete, setOpenDelete] = useState(false);
const [pageToDelete, setPageToDelete] = useState<string | null>(null);
const [deleteError, setDeleteError] = useState<string | null>(null);

const [openEdit, setOpenEdit] = useState(false);
const [pageToEdit, setPageToEdit] = useState<Page | null>(null);
const [editTitle, setEditTitle] = useState("");

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
      is_main: !parent,
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

const deletePage = async () => {
  if (!pageToDelete) return;

  const hasChildren = pages.some(
    (p) => p.parent_slug === pageToDelete
  );

  if (hasChildren) {
    setDeleteError(
      "No puedes eliminar esta página porque tiene subpáginas."
    );
    return;
  }

  try {
    // 1. obtener media
    const { data: media } = await supabase
      .from("page_media")
      .select("file_path")
      .eq("page_slug", pageToDelete);

    // 2. borrar storage
    if (media?.length) {
      const paths = media.map((m) => m.file_path);

      const { error: storageError } = await supabase.storage
        .from("pages")
        .remove(paths);

      if (storageError) {
        console.error(storageError);
        setDeleteError("Error eliminando archivos del storage.");
        return;
      }
    }

    // 3. borrar media en DB
    await supabase
      .from("page_media")
      .delete()
      .eq("page_slug", pageToDelete);

    // 4. borrar página
    const { error } = await supabase
      .from("pages")
      .delete()
      .eq("slug", pageToDelete);

    if (error) {
      console.error(error);
      setDeleteError("Error al eliminar la página.");
      return;
    }

    setOpenDelete(false);
    setPageToDelete(null);
    setDeleteError(null);

    await fetchPages();
    setActiveSlug("carousel");

  } catch (err) {
    console.error(err);
    setDeleteError("Error inesperado al eliminar.");
  }
};

const updatePageTitle = async () => {
  if (!pageToEdit) return;

  const { error } = await supabase
    .from("pages")
    .update({
      title: editTitle,
      updated_at: new Date().toISOString(),
    })
    .eq("slug", pageToEdit.slug);

  if (error) {
    console.error(error);
    return;
  }

  setOpenEdit(false);
  setPageToEdit(null);
  setEditTitle("");

  await fetchPages();
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
<>
  {/* HEADER DEL CONTENIDO */}
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      mb: 2,
    }}
  >
    {/* TITULO */}
    <Typography variant="h4">
      {pages.find((p) => p.slug === activeSlug)?.title}
    </Typography>

    {/* BOTONES */}
    <Box sx={{ display: "flex", gap: 1 }}>
      <Button
        size="small"
         variant="contained"
        onClick={() => {
          const page = pages.find((p) => p.slug === activeSlug);
          if (!page) return;

          setPageToEdit(page);
          setEditTitle(page.title || "");
          setOpenEdit(true);
        }}
      >
        Renombrar
      </Button>

      <Button
        size="small"
         variant="contained"
        color="error"
        onClick={() => {
          setPageToDelete(activeSlug);
          setDeleteError(null);
          setOpenDelete(true);
        }}
      >
        Eliminar
      </Button>
    </Box>
  </Box>

  {/* EDITOR */}
  <AdminPageEditor slug={activeSlug} />
</>
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
{isNavGroup && (
  <Typography
    variant="body2"
    sx={{
      mt: 1,
      color: "warning.main",
      backgroundColor: "#fff3cd",
      p: 1,
      borderRadius: 1,
    }}
  >
    ⚠️ Este grupo no aparecerá en el menú hasta que tenga al menos una subpágina dentro.
  </Typography>
)}
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
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
  <DialogTitle>Eliminar página</DialogTitle>

  <DialogContent>
    <Typography>
      ¿Seguro que quieres eliminar{" "}
      <strong>
        {pages.find((p) => p.slug === pageToDelete)?.title}
      </strong>
      ?
    </Typography>

    <Typography sx={{ mt: 1 }} color="error">
      Esta acción no se puede deshacer.
    </Typography>

    {deleteError && (
      <Typography sx={{ mt: 2 }} color="error">
        {deleteError}
      </Typography>
    )}
  </DialogContent>

  <DialogActions>
    <Button onClick={() => setOpenDelete(false)}>
      Cancelar
    </Button>

    <Button
      variant="contained"
      color="error"
      onClick={deletePage}
    >
      Eliminar
    </Button>
  </DialogActions>
</Dialog>
<Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
  <DialogTitle >Editar nombre de la página</DialogTitle>

  <DialogContent>
    <TextField
      fullWidth
      label="Nombre visible"
      value={editTitle}
      onChange={(e) => setEditTitle(e.target.value)}
       sx={{
    mt: 2,
    backgroundColor: "#fff",
    borderRadius: 1,
  }}
    />

    <Typography sx={{ mt: 2 }} color="whitte">
      Este es el nombre que aparecerá en el menú y en los tabs.
    </Typography>
  </DialogContent>

  <DialogActions>
    <Button onClick={() => setOpenEdit(false)}>
      Cancelar
    </Button>

    <Button variant="contained" onClick={updatePageTitle}>
      Guardar
    </Button>
  </DialogActions>
</Dialog>
    </Box>
  );
};

export default AdminPanel;