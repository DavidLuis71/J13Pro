import { useEffect, useState } from "react";
import { supabase } from "../api/supabaseClient";
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

const sanitizeFileName = (name: string) =>
  name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quita acentos
    .replace(/[^a-z0-9.\-_]/g, "-"); // reemplaza caracteres raros

const compressImage = async (file: File, maxWidth = 1600, quality = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = (event: any) => {
      const img = new Image();

      img.src = event.target.result;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const scale = maxWidth / img.width;

        canvas.width = maxWidth;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(file);

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            if (!blob) return resolve(file);

            const compressedFile = new File(
              [blob],
              file.name,
              { type: "image/jpeg", lastModified: Date.now() }
            );

            resolve(compressedFile);
          },
          "image/jpeg",
          quality
        );
      };
    };
  });
};
interface Album {
  id: string;
  name: string;
  slug: string;
  cover_url?: string;
}

interface Image {
  id: string;
  file_path: string;
  url: string;
}

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");

export default function AdminGallery() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [images, setImages] = useState<Image[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);

  const [openCreate, setOpenCreate] = useState(false);
  const [newName, setNewName] = useState("");

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
const [albumToDelete, setAlbumToDelete] = useState<string | null>(null);

const [uploading, setUploading] = useState(false);
const [uploadProgress, setUploadProgress] = useState(0);

const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  // ---------------- ALBUMS ----------------
  const fetchAlbums = async () => {
    const { data } = await supabase
      .from("gallery_albums")
      .select("*")
      .order("created_at", { ascending: false });

    setAlbums(data || []);
  };

  // ---------------- IMAGES ----------------
  const fetchImages = async (slug: string) => {
    const { data } = await supabase
      .from("gallery_images")
      .select("*")
      .eq("album_slug", slug);

    setImages(data || []);
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  useEffect(() => {
    if (selectedAlbum) fetchImages(selectedAlbum);
  }, [selectedAlbum]);

  // ---------------- CREATE ALBUM ----------------
  const createAlbum = async () => {
    const slug = slugify(newName);

    await supabase.from("gallery_albums").insert({
      name: newName,
      slug,
    });

    setNewName("");
    setOpenCreate(false);
    fetchAlbums();
  };

  // ---------------- DELETE ALBUM ----------------
 const deleteAlbum = async () => {
  if (!albumToDelete) return;

  // 1. borrar imágenes del storage (opcional pero recomendado)
  const { data: imgs } = await supabase
    .from("gallery_images")
    .select("file_path")
    .eq("album_slug", albumToDelete);

  if (imgs?.length) {
    await supabase.storage
      .from("gallery")
      .remove(imgs.map((i) => i.file_path));
  }

  // 2. borrar imágenes de la tabla
  await supabase
    .from("gallery_images")
    .delete()
    .eq("album_slug", albumToDelete);

  // 3. borrar álbum
  await supabase
    .from("gallery_albums")
    .delete()
    .eq("slug", albumToDelete);

  if (selectedAlbum === albumToDelete) {
    setSelectedAlbum(null);
  }

  setAlbumToDelete(null);
  setConfirmDeleteOpen(false);
  fetchAlbums();
};

  // ---------------- UPLOAD IMAGE ----------------
const uploadImage = async (e: any) => {
  const files = Array.from(e.target.files) as File[];

  if (!files.length || !selectedAlbum) return;

  setUploading(true);
  setUploadProgress(0);

  let completed = 0;


  // separar solo imágenes
  const imageFiles = files.filter((file) => file.type.startsWith("image/"));
  const videoFiles = files.filter((file) => file.type.startsWith("video/"));

  const total = imageFiles.length;

  // si no hay imágenes
  if (total === 0) {
    setUploading(false);
    setUploadProgress(0);

    e.target.value = "";
    return;
  }

  const compressedFiles = await Promise.all(
    imageFiles.map((f) => compressImage(f, 1600, 0.75))
  );

  await Promise.all(
    compressedFiles.map(async (file) => {
      try {
        const cleanName = sanitizeFileName(file.name);
        const filePath = `${selectedAlbum}/${Date.now()}-${cleanName}`;

        const { error: uploadError } = await supabase.storage
          .from("gallery")
          .upload(filePath, file);

        if (uploadError) {
          console.error(uploadError);
          completed++;
          setUploadProgress(Math.round((completed / total) * 100));
          return;
        }

        const { data } = supabase.storage
          .from("gallery")
          .getPublicUrl(filePath);

        await supabase.from("gallery_images").insert({
          album_slug: selectedAlbum,
          file_path: filePath,
          url: data.publicUrl,
          alt: file.name,
        });

        completed++;
        setUploadProgress(Math.round((completed / total) * 100));
      } catch (err) {
        console.error(err);
        completed++;
        setUploadProgress(Math.round((completed / total) * 100));
      }
    })
  );

  await fetchImages(selectedAlbum);

  setUploading(false);
  setUploadProgress(100);

  setTimeout(() => setUploadProgress(0), 400);

  // 👇 MENSAJE FINAL SI HABÍA VIDEOS
 if (videoFiles.length > 0) {
  setVideoDialogOpen(true);
}

  e.target.value = "";
};

  // ---------------- DELETE IMAGE ----------------
  const deleteImage = async (img: Image) => {
    await supabase.storage.from("gallery").remove([img.file_path]);

    await supabase.from("gallery_images").delete().eq("id", img.id);

    if (selectedAlbum) fetchImages(selectedAlbum);
  };
const setAlbumCover = async (albumSlug: string, imageUrl: string) => {
  const { error } = await supabase
    .from("gallery_albums")
    .update({ cover_url: imageUrl })
    .eq("slug", albumSlug);

  if (error) {
    console.error(error);
    return;
  }

  fetchAlbums();
};
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Galería
      </Typography>

      {/* CREATE */}
      <Button variant="contained" onClick={() => setOpenCreate(true)}>
        + Crear álbum
      </Button>

    {/* ALBUMS */}
<Box
  sx={{
    display: "grid",
    gridTemplateColumns: {
      xs: "repeat(2, 1fr)",
      sm: "repeat(3, 1fr)",
      md: "repeat(4, 1fr)",
    },
    gap: 2,
    mt: 3,
  }}
>
  {albums.map((a) => (
    <Box
      key={a.slug}
      onClick={() => setSelectedAlbum(a.slug)}
      sx={{
        position: "relative",
        borderRadius: 3,
        overflow: "hidden",
        cursor: "pointer",
        height: { xs: 140, sm: 160, md: 180 },

       border:
  selectedAlbum === a.slug
    ? "2px solid var(--gold)"
    : "1px solid rgba(0,0,0,0.08)",

        boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
        transition: "0.3s ease",

        "&:hover": {
          transform: "scale(1.03)",
        },

        "&:hover .albumOverlay": {
          background: "rgba(0,0,0,0.45)",
        },

        "&:hover .deleteAlbumBtn": {
          opacity: 1,
          transform: "scale(1)",
        },
      }}
    >
      {/* COVER IMAGE */}
      {a.cover_url ? (
        <img
          src={a.cover_url}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "0.3s ease",
          }}
        />
      ) : (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(135deg, #111, #222)",
          }}
        />
      )}

      {/* OVERLAY */}
      <Box
        className="albumOverlay"
        sx={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.25)",
          transition: "0.3s",
        }}
      />

      {/* TEXT */}
      <Box
        sx={{
          position: "absolute",
          bottom: 10,
          left: 10,
          right: 10,
          zIndex: 2,
        }}
      >
        <Typography
          sx={{
            color: "white",
            fontWeight: "bold",
            fontSize: "1rem",
            textShadow: "1px 1px 3px rgba(0,0,0,0.8)",
          }}
        >
          📁 {a.name}
        </Typography>
        {a.cover_url && (
    <Typography
      sx={{
        fontSize: "10px",
        color: "gold",
        mt: 0.5,
        textShadow: "1px 1px 3px rgba(0,0,0,0.8)",
      }}
    >
      ⭐ Portada asignada
    </Typography>
  )}
      </Box>

      {/* DELETE BUTTON (SIEMPRE VISIBLE, MEJOR UX MOBILE) */}
      <IconButton
        className="deleteAlbumBtn"
      onClick={(e) => {
  e.stopPropagation();
  setAlbumToDelete(a.slug);
  setConfirmDeleteOpen(true);
}}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          backgroundColor: "rgba(0,0,0,0.7)",
          color: "var(--gold)",
          width: 34,
          height: 34,
          zIndex: 3,
          opacity: 1, // 👈 IMPORTANTE: ya no oculto
          transition: "0.3s",

          "&:hover": {
            backgroundColor: "rgba(0,0,0,0.9)",
            transform: "scale(1.1)",
          },
        }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Box>
  ))}
</Box>

      {/* UPLOAD */}

{selectedAlbum && (
  <Box sx={{ mt: 4 }}>
    
    {/* HEADER ÁLBUM */}
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 2,
        borderBottom: "1px solid #eee",
        pb: 1,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
        📁 Álbum: {selectedAlbum}
      </Typography>

      <Button variant="contained" component="label">
        Subir imágenes
        <input hidden type="file" multiple onChange={uploadImage} />
      </Button>
    
    </Box>
    <Box>
{uploading && (
  <Box
    sx={{
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0,0,0,0.7)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
      color: "white",
    }}
  >
    <Typography sx={{ mb: 2, fontWeight: "bold" }}>
      Subiendo imágenes... {uploadProgress}%
    </Typography>

    <Box
      sx={{
        width: "80%",
        maxWidth: 300,
        height: 8,
        backgroundColor: "rgba(255,255,255,0.2)",
        borderRadius: 5,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          width: `${uploadProgress}%`,
          height: "100%",
          backgroundColor: "var(--gold)",
          transition: "width 0.2s ease",
        }}
      />
    </Box>
  </Box>
)}
        </Box>

   {/* GRID DE IMÁGENES */}
<Box
  sx={{
    display: "grid",
    gridTemplateColumns: {
      xs: "repeat(2, 1fr)",
      sm: "repeat(3, 1fr)",
      md: "repeat(4, 1fr)",
    },
    gap: 2,
  }}
>
 {images.map((img) => (
  <Box
    key={img.id}
    sx={{
      position: "relative",
      borderRadius: 2,
      overflow: "hidden",
      height: { xs: 130, sm: 160, md: 180 },
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      cursor: "pointer",
      transition: "0.3s ease",

      "&:hover": {
        transform: "scale(1.02)",
      },

      "&:hover img": {
        transform: "scale(1.08)",
      },
    }}
  >
    {/* IMAGE */}
    <img
      src={img.url}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        transition: "0.3s ease",
      }}
    />

    {/* DARK OVERLAY */}
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        background:
          "linear-gradient(to top, rgba(0,0,0,0.4), transparent 60%)",
      }}
    />

    {/* DELETE */}
    <IconButton
      onClick={() => deleteImage(img)}
      sx={{
        position: "absolute",
        top: 8,
        right: 8,
        backgroundColor: "rgba(0,0,0,0.65)",
        color: "var(--gold)",
        width: 34,
        height: 34,
        zIndex: 2,

        "&:hover": {
          backgroundColor: "rgba(0,0,0,0.9)",
          transform: "scale(1.1)",
        },
      }}
    >
      <DeleteIcon fontSize="small" />
    </IconButton>

    {/* ⭐ SET AS COVER BUTTON */}
    <Button
      size="small"
      onClick={() => setAlbumCover(selectedAlbum!, img.url)}
      sx={{
        position: "absolute",
        bottom: 6,
        left: 6,
        fontSize: "10px",
        minWidth: "unset",
        padding: "2px 6px",
        backgroundColor: "rgba(0,0,0,0.6)",
        color: "white",
        zIndex: 2,

        "&:hover": {
          backgroundColor: "rgba(0,0,0,0.85)",
        },
      }}
    >
      Portada
    </Button>
  </Box>
))}
</Box>
  </Box>
)}

      {/* DIALOG */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)}>
        <DialogTitle>Crear álbum</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nombre del álbum"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)}>Cancelar</Button>
          <Button variant="contained" onClick={createAlbum}>
            Crear
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
  open={confirmDeleteOpen}
  onClose={() => setConfirmDeleteOpen(false)}
>
  <DialogTitle>¿Eliminar álbum?</DialogTitle>

  <DialogContent>
    <Typography>
      Esta acción eliminará el álbum y todas sus imágenes. No se puede deshacer.
    </Typography>
  </DialogContent>

  <DialogActions>
    <Button onClick={() => setConfirmDeleteOpen(false)}>
      Cancelar
    </Button>

    <Button color="error" variant="contained" onClick={deleteAlbum}>
      Eliminar
    </Button>
  </DialogActions>
</Dialog>
<Dialog
  open={videoDialogOpen}
  onClose={() => setVideoDialogOpen(false)}
>
  <DialogTitle>Archivos no compatibles</DialogTitle>

  <DialogContent>
    <Typography>
      Los vídeos no son compatibles con los álbumes.
      <br />
      Solo se han subido las imágenes seleccionadas.
    </Typography>
  </DialogContent>

  <DialogActions>
    <Button
      variant="contained"
      onClick={() => setVideoDialogOpen(false)}
    >
      Entendido
    </Button>
  </DialogActions>
</Dialog>
    </Box>
  );
}