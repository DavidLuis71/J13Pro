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
  type: "image" | "video";
}

interface Image {
  id: string;
  url: string;
}

export default function Gallery() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [images, setImages] = useState<Image[]>([]);

  // 👇 NUEVO SISTEMA
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  // ---------------- LOAD ALBUMS ----------------
  const fetchAlbums = async () => {
    const { data } = await supabase
      .from("gallery_albums")
      .select("*")
      .order("created_at", { ascending: false });

    setAlbums(data || []);
  };

  // ---------------- LOAD MEDIA ----------------
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
    setSelectedImageIndex(null);
  };

  // ---------------- IMAGE LIGHTBOX ----------------
  const openImage = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeImage = () => {
    setSelectedImageIndex(null);
  };

  const goNext = () => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const goPrev = () => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const isVideoAlbum = selectedAlbum?.type === "video";

  return (
    <Box
      onContextMenu={(e) => e.preventDefault()}
      sx={{ width: "100vw", minHeight: "100vh", overflowX: "hidden" }}
    >
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
                "&:hover": { transform: "scale(1.03)" },
              }}
            >
              {a.type === "video" ? (
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    background: "black",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  <Typography sx={{ fontSize: "3rem", color: "white" }}>
                    ▶
                  </Typography>
                </Box>
              ) : a.cover_url ? (
                <img
                  src={a.cover_url}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <Box sx={{ width: "100%", height: "100%", background: "#111" }} />
              )}

              <Box
                sx={{
                  position: "absolute",
                  bottom: 10,
                  left: 10,
                  color: "white",
                }}
              >
                <Typography sx={{ fontWeight: "bold" }}>
                  {a.name}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {/* ---------------- ALBUM VIEW ---------------- */}
      <Dialog fullScreen open={!!selectedAlbum} onClose={closeAlbum}>
        <DialogContent sx={{ backgroundColor: "#0a0a0a", color: "white" }}>
          {/* HEADER */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <IconButton onClick={closeAlbum} sx={{ color: "white" }}>
              <ArrowBackIcon />
            </IconButton>

            <Typography sx={{ ml: 2, fontWeight: "bold" }}>
              {selectedAlbum?.name}
            </Typography>
          </Box>

          {/* VIDEO */}
          {isVideoAlbum ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              {images[0] ? (
                <video
                  src={images[0].url}
                  controls
                  style={{ maxWidth: "100%", maxHeight: "80vh" }}
                />
              ) : (
                <Typography>No hay vídeo</Typography>
              )}
            </Box>
          ) : (
            /* GRID IMAGES */
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
              {images.map((img, index) => (
                <Box
                  key={img.id}
                  onClick={() => openImage(index)}
                  sx={{
                    height: 160,
                    borderRadius: 2,
                    overflow: "hidden",
                    cursor: "pointer",
                    "&:hover": { transform: "scale(1.03)" },
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
          )}
        </DialogContent>
      </Dialog>

      {/* ---------------- LIGHTBOX (NAVEGACIÓN) ---------------- */}
      <Dialog
        open={selectedImageIndex !== null}
        onClose={closeImage}
        maxWidth="md"
        fullWidth
      >
        <DialogContent
          sx={{
            backgroundColor: "#000",
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 0,
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
              zIndex: 2,
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* LEFT */}
          <IconButton
            onClick={goPrev}
            sx={{
              position: "absolute",
              left: 10,
              color: "white",
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 2,
            }}
          >
            ←
          </IconButton>

          {/* IMAGE */}
          {selectedImageIndex !== null && (
            <img
              src={images[selectedImageIndex].url}
              style={{
                width: "100%",
                maxHeight: "90vh",
                objectFit: "contain",
              }}
            />
          )}

          {/* RIGHT */}
          <IconButton
            onClick={goNext}
            sx={{
              position: "absolute",
              right: 10,
              color: "white",
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 2,
            }}
          >
            →
          </IconButton>
        </DialogContent>
      </Dialog>
    </Box>
  );
}