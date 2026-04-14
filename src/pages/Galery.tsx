import { useEffect, useState } from "react";
import { supabase } from "../api/supabaseClient";
import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogContent,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";

interface Album {
  id: string;
  name: string;
  slug: string;
  cover_url?: string;
}

interface Image {
  id: string;
  url: string;
}

export default function Gallery() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [images, setImages] = useState<Image[]>([]);

  // 👉 NUEVO: imagen abierta en grande
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  // ---------------- LOAD ALBUMS ----------------
  const fetchAlbums = async () => {
    const { data } = await supabase
      .from("gallery_albums")
      .select("*")
      .order("created_at", { ascending: false });

    setAlbums(data || []);
  };

  // ---------------- LOAD IMAGES ----------------
  const fetchImages = async (slug: string) => {
    const { data } = await supabase
      .from("gallery_images")
      .select("id, url")
      .eq("album_slug", slug)
      .order("created_at", { ascending: false });

    setImages(data || []);
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  const openAlbum = (album: Album) => {
    setSelectedAlbum(album);
    fetchImages(album.slug);
  };

  const closeAlbum = () => {
    setSelectedAlbum(null);
    setImages([]);
  };

  const openImage = (img: Image) => {
    setSelectedImage(img);
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

  return (
    <Box sx={{ width: "100vw", minHeight: "100vh", overflowX: "hidden" }}>
      
      

      {/*
      <Box
        sx={{
          textAlign: "center",
          py: 5,
          background: "linear-gradient(180deg, #111, #000)",
          color: "white",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          📸 Galería
        </Typography>
      </Box> */}

      {/* ---------------- ALBUM GRID ---------------- */}
      {!selectedAlbum && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, 1fr)",
              sm: "repeat(3, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 2,
            px: 2,
            py: 4,
          }}
        >
          {albums.map((a) => (
            <Box
              key={a.slug}
              onClick={() => openAlbum(a)}
              sx={{
                position: "relative",
                borderRadius: 3,
                overflow: "hidden",
                cursor: "pointer",
                height: 180,
                boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
                transition: "0.3s",

                "&:hover": {
                  transform: "scale(1.03)",
                },
              }}
            >
              {a.cover_url ? (
                <img
                  src={a.cover_url}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(135deg, #111, #222)",
                  }}
                />
              )}

              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                }}
              />

             <Box
  sx={{
    position: "absolute",
    bottom: 10,
    left: 10,
    backgroundColor: "rgba(0,0,0,0.55)",
    backdropFilter: "blur(4px)",
    px: 1.5,
    py: 0.5,
    borderRadius: 2,
  }}
>
  <Typography sx={{ fontWeight: "bold", fontSize: "0.9rem", color: "white" }}>
    📁 {a.name}
  </Typography>
</Box>
            </Box>
          ))}
        </Box>
      )}

      {/* ---------------- ALBUM VIEW ---------------- */}
      <Dialog fullScreen open={!!selectedAlbum} onClose={closeAlbum}>
        <DialogContent sx={{ backgroundColor: "#0a0a0a", color: "white", p: 2 }}>
          
          {/* HEADER */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <IconButton onClick={closeAlbum} sx={{ color: "white" }}>
              <ArrowBackIcon />
            </IconButton>

            <Typography sx={{ ml: 2, fontWeight: "bold" }}>
              {selectedAlbum?.name}
            </Typography>
          </Box>

          {/* IMAGES GRID */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                sm: "repeat(3, 1fr)",
                md: "repeat(4, 1fr)",
              },
              gap: 1,
            }}
          >
            {images.map((img) => (
              <Box
                key={img.id}
                onClick={() => openImage(img)}   // 👈 CLICK PARA ABRIR
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  height: 160,
                  cursor: "pointer",
                  transition: "0.3s",

                  "&:hover": {
                    transform: "scale(1.03)",
                  },
                }}
              >
                <img
                  src={img.url}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>
            ))}
          </Box>
        </DialogContent>
      </Dialog>

      {/* ---------------- IMAGE MODAL ---------------- */}
      <Dialog
        open={!!selectedImage}
        onClose={closeImage}
        maxWidth="md"
        fullWidth
      >
        <DialogContent
          sx={{
            backgroundColor: "#000",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 0,
            position: "relative",
          }}
        >
          {/* CLOSE */}
          <IconButton
            onClick={closeImage}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              color: "white",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* IMAGE BIG */}
          {selectedImage && (
            <img
              src={selectedImage.url}
              style={{
                width: "100%",
                maxHeight: "90vh",
                objectFit: "contain",
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      
    </Box>
  );
}