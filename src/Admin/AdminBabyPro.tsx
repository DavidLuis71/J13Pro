import { useEffect, useState } from "react";
import { supabase } from "../api/supabaseClient";
import { Box, Typography, TextField, Button, Input } from "@mui/material";

const AdminBabyPro: React.FC = () => {
  const [content, setContent] = useState("");
  const [video, setVideo] = useState<File | null>(null);
  const [videoURL, setVideoURL] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Cargar datos
  const fetchData = async () => {
    const { data, error } = await supabase.from("baby_pro").select("*").single();

    if (error) {
      console.error(error);
      setMessage("Error cargando datos");
    } else {
      setContent(data.content || "");
      setVideoURL(data.video_url || "");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔹 Subir video
  const handleUploadVideo = async () => {
    if (!video) return;

    setLoading(true);

    const fileName = `${Date.now()}_${video.name}`;

    const { data, error } = await supabase.storage
      .from("baby-pro")
      .upload(fileName, video);

    if (error) {
      console.error(error);
      setMessage("Error subiendo el video");
      setLoading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("baby-pro")
      .getPublicUrl(data.path);

    setVideoURL(urlData.publicUrl);
    setLoading(false);
  };

  // 🔹 Guardar contenido
const handleSave = async () => {
  setLoading(true);

  // 1️⃣ Verificar si existe
  const { data: existing, error: fetchError } = await supabase
    .from("baby_pro")
    .select("*")
    .single();

  if (fetchError && fetchError.code !== "PGRST116") { // PGRST116 = no hay fila
    console.error(fetchError);
    setMessage("Error verificando fila");
    setLoading(false);
    return;
  }

  if (existing) {
    // ✅ Actualizar
    const { error } = await supabase
      .from("baby_pro")
      .update({
        content,
        video_url: videoURL,
        updated_at: new Date(),
      })
      .eq("id", existing.id);

    if (error) console.error(error);
    setMessage(error ? "Error guardando" : "Guardado correctamente ✅");
  } else {
    // 🆕 Insertar
    const { error } = await supabase
      .from("baby_pro")
      .insert({
        content,
        video_url: videoURL,
        updated_at: new Date(),
      });

    if (error) console.error(error);
    setMessage(error ? "Error insertando" : "Guardado correctamente ✅");
  }

  setLoading(false);
};

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Baby Pro
      </Typography>

      {/* VIDEO */}
      <Typography variant="h6">Video</Typography>

      <Input
        type="file"
        onChange={(e) => setVideo(e.target.files?.[0] || null)}
      />

      <Button onClick={handleUploadVideo} disabled={loading}>
        Subir Video
      </Button>

      {videoURL && (
        <video
          src={videoURL}
          controls
          style={{ width: "100%", maxHeight: 200, marginTop: 10 }}
        />
      )}

      {/* CONTENIDO */}
      <Typography variant="h6" sx={{ mt: 4 }}>
        Contenido (HTML)
      </Typography>

      <TextField
        multiline
        minRows={10}
        fullWidth
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      {/* BOTÓN GUARDAR */}
      <Button
        variant="contained"
        sx={{ mt: 3 }}
        onClick={handleSave}
        disabled={loading}
      >
        Guardar cambios
      </Button>

      {message && (
        <Typography sx={{ mt: 2 }}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default AdminBabyPro;