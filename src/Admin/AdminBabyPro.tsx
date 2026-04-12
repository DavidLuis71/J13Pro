import { useEffect, useState } from "react";
import { supabase } from "../api/supabaseClient";
import {
  Box,
  Typography,
  TextField,
  Button,
  Input,
  Grid,
  Paper,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface MediaItem {
  id: string;
  url: string;
  alt: string;
  type: "image" | "video";
  order_index: number;
  page_slug: string;
}

const PAGE_SLUG = "baby-pro";

const AdminBabyPro: React.FC = () => {
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ---------------------------
  // LOAD DATA
  // ---------------------------
  const fetchData = async () => {
    const { data: page } = await supabase
      .from("pages")
      .select("content")
      .eq("slug", PAGE_SLUG)
      .single();

    if (page) setContent(page.content || "");

    const { data: mediaData, error } = await supabase
      .from("page_media")
      .select("*")
      .eq("page_slug", PAGE_SLUG)
      .order("order_index", { ascending: true });

    if (!error) setMedia(mediaData || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ---------------------------
  // SAVE CONTENT
  // ---------------------------
  const handleSaveContent = async () => {
    setLoading(true);

    const { data: existing } = await supabase
      .from("pages")
      .select("id")
      .eq("slug", PAGE_SLUG)
      .single();

    if (existing) {
      await supabase
        .from("pages")
        .update({
          content,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);
    } else {
      await supabase.from("pages").insert({
        slug: PAGE_SLUG,
        content,
        updated_at: new Date().toISOString(),
      });
    }

    setMessage("Contenido guardado ✅");
    setLoading(false);
  };

  // ---------------------------
  // UPLOAD MULTIPLE MEDIA
  // ---------------------------
  const handleUploadMedia = async () => {
    if (!files.length) return;

    setLoading(true);

    const bucket = "baby-pro";

    try {
      const uploads = files.map(async (file) => {
        const fileName = `${Date.now()}_${file.name}`;

        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(fileName, file);

        if (error) throw error;

        const { data: urlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(data.path);

        const type = file.type.startsWith("video") ? "video" : "image";

        return {
          page_slug: PAGE_SLUG,
          url: urlData.publicUrl,
          alt: file.name,
          type,
          order_index: media.length,
        };
      });

      const results = await Promise.all(uploads);

      const { error: dbError } = await supabase
        .from("page_media")
        .insert(results);

      if (dbError) throw dbError;

      setMessage("Media subida correctamente ✅");
      setFiles([]);
      fetchData();
    } catch (err) {
      console.error(err);
      setMessage("Error subiendo archivos ❌");
    }

    setLoading(false);
  };

  // ---------------------------
  // DELETE MEDIA
  // ---------------------------
  const handleDelete = async (item: MediaItem) => {
    const path = item.url.split("/").pop();

    await supabase.storage.from("baby-pro").remove([path!]);
    await supabase.from("page_media").delete().eq("id", item.id);

    fetchData();
    setMessage("Eliminado ✅");
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4">Admin Baby Pro</Typography>

      {/* CONTENT */}
      <Typography variant="h6" sx={{ mt: 3 }}>
        Contenido
      </Typography>

      <TextField
        multiline
        minRows={6}
        fullWidth
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <Button
        variant="contained"
        sx={{ mt: 2 }}
        onClick={handleSaveContent}
        disabled={loading}
      >
        Guardar contenido
      </Button>

      {/* UPLOAD MULTIPLE */}
      <Typography variant="h6" sx={{ mt: 5 }}>
        Subir media
      </Typography>

      <Input
        type="file"
        inputProps={{ multiple: true }}
       onChange={(e) => {
  const target = e.target as HTMLInputElement;
  setFiles(Array.from(target.files || []));
}}
      />

      {files.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2">
            {files.length} archivo(s) seleccionados
          </Typography>

          <Grid container spacing={1} sx={{ mt: 1 }}>
            {files.map((file, i) => (
              <Grid key={i}>
                <Paper sx={{ p: 1 }}>
                  {file.type.startsWith("video") ? (
                    <video
                      src={URL.createObjectURL(file)}
                      style={{
                        width: 120,
                        height: 80,
                        objectFit: "cover",
                        borderRadius: 6,
                      }}
                    />
                  ) : (
                    <img
                      src={URL.createObjectURL(file)}
                      style={{
                        width: 120,
                        height: 80,
                        objectFit: "cover",
                        borderRadius: 6,
                      }}
                    />
                  )}
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      <Button
        variant="contained"
        sx={{ mt: 2 }}
        onClick={handleUploadMedia}
        disabled={!files.length || loading}
      >
        {loading ? "Subiendo..." : "Subir archivos"}
      </Button>

      {/* MEDIA LIST */}
      <Grid container spacing={2} sx={{ mt: 4 }}>
        {media.map((item) => (
          <Grid key={item.id} size={{ xs: 6, sm: 4, md: 3 }}>
            <Paper sx={{ position: "relative", p: 1 }}>
              {item.type === "video" ? (
                <video
                  src={item.url}
                  controls
                  style={{
                    width: "100%",
                    height: 120,
                    objectFit: "cover",
                    borderRadius: 6,
                  }}
                />
              ) : (
                <img
                  src={item.url}
                  style={{
                    width: "100%",
                    height: 120,
                    objectFit: "cover",
                    borderRadius: 6,
                  }}
                />
              )}

              <IconButton
                onClick={() => handleDelete(item)}
                sx={{ position: "absolute", top: 5, right: 5 }}
              >
                <DeleteIcon />
              </IconButton>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {message && (
        <Typography sx={{ mt: 2 }}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default AdminBabyPro;