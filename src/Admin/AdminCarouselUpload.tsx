import { useState, useEffect } from "react";
import { supabase } from "../api/supabaseClient";
import { Box, Button, Typography, Input, Grid, Paper, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface CarouselImage {
  id: number;
  url: string;
  alt: string;
  order_index: number;
}

const AdminCarouselUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [images, setImages] = useState<CarouselImage[]>([]);

  // 1️⃣ Obtener imágenes del carrusel
  const fetchImages = async () => {
    const { data, error } = await supabase.from("carousel_images").select("*").order("order_index");
    if (error) {
      console.error(error);
      setMessage("Error cargando las imágenes");
    } else {
      setImages(data);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setMessage("");

    const fileName = `${Date.now()}_${file.name}`;

    // Subir al bucket
    const { data: uploadData, error } = await supabase.storage
      .from("carousel")
      .upload(fileName, file);

    if (error) {
      console.error(error);
      setMessage("Error subiendo la imagen");
      setUploading(false);
      return;
    }

    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from("carousel")
      .getPublicUrl(uploadData!.path);

    const publicURL = urlData.publicUrl;

    if (!publicURL) {
      setMessage("Error obteniendo la URL pública");
      setUploading(false);
      return;
    }

    // Insertar en la tabla carousel_images
    const { error: dbError } = await supabase
      .from("carousel_images")
      .insert([{ url: publicURL, alt: file.name, order_index: images.length }]);

    if (dbError) {
      console.error(dbError);
      setMessage("Error guardando la imagen en la base de datos");
    } else {
      setMessage("Imagen subida correctamente");
      setFile(null);
      fetchImages(); // actualizar la lista
    }

    setUploading(false);
  };

  // 2️⃣ Borrar imagen
  const handleDelete = async (id: number, path: string) => {
    // Borrar de storage
    const { error: storageError } = await supabase.storage.from("carousel").remove([path]);
    if (storageError) {
      console.error(storageError);
      setMessage("Error borrando la imagen del bucket");
      return;
    }

    // Borrar de base de datos
    const { error: dbError } = await supabase.from("carousel_images").delete().eq("id", id);
    if (dbError) {
      console.error(dbError);
      setMessage("Error borrando la imagen de la base de datos");
    } else {
      setMessage("Imagen borrada correctamente");
      fetchImages();
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Subir imágenes al Carrusel
      </Typography>

      <Box sx={{ marginBottom: 3 }}>
        <Input
          type="file"
          onChange={e => setFile(e.target.files?.[0] || null)}
          disabled={uploading}
        />
        <Button onClick={handleUpload} disabled={!file || uploading} sx={{ ml: 2 }}>
          {uploading ? "Subiendo..." : "Subir Imagen"}
        </Button>
      </Box>

      {message && (
        <Typography variant="body1" color={message.includes("Error") ? "error" : "success.main"}>
          {message}
        </Typography>
      )}

      {/* 3️⃣ Mostrar imágenes existentes */}
      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        Imágenes del Carrusel
      </Typography>
<Grid container spacing={2}>
  {images.map(img => {
    const isVideo = img.url.match(/\.(mp4|webm|ogg)$/i);

    return (
      <Grid key={img.id}>
        <Paper sx={{ position: "relative", padding: 1 }}>
          {isVideo ? (
            <video
              src={img.url}
              controls
              muted
              style={{
                width: "100%",
                height: 100,         // igual que las imágenes
                objectFit: "cover",  // mantiene proporciones y recorta si hace falta
                borderRadius: 4,
              }}
            />
          ) : (
            <img
              src={img.url}
              alt={img.alt}
              style={{
                width: "100%",
                height: 100,
                objectFit: "cover",
                borderRadius: 4,
              }}
            />
          )}

          <IconButton
            size="small"
            sx={{ position: "absolute", top: 4, right: 4 }}
            onClick={() => handleDelete(img.id, img.url.split("/").slice(-1)[0])}
          >
            <DeleteIcon fontSize="small" sx={{ color: "var(--gold)" }} />
          </IconButton>
        </Paper>
      </Grid>
    );
  })}
</Grid>
    </Box>
  );
};

export default AdminCarouselUpload;