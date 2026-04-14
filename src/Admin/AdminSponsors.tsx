import { useEffect, useState } from "react";
import { supabase } from "../api/supabaseClient";
import {
  Box,
  Button,
  Typography,
  Input,
  Paper,
  Grid,
  TextField,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface Sponsor {
  id: string;
  name: string;
  description: string;
  image_url: string;
  website: string | null;
}

const AdminSponsors: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [uploading, setUploading] = useState(false);

  // 🔄 FETCH
  const fetchSponsors = async () => {
    const { data, error } = await supabase
      .from("sponsors")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.error(error);
    else setSponsors(data || []);
  };

  useEffect(() => {
    fetchSponsors();
  }, []);

  // 📤 UPLOAD
  const handleUpload = async () => {
    if (!file || !name) return;

    setUploading(true);

    const fileName = `${Date.now()}_${file.name}`;

    // 1. subir imagen
    const { error: uploadError } = await supabase.storage
      .from("sponsors")
      .upload(fileName, file);

    if (uploadError) {
      console.error(uploadError);
      setUploading(false);
      return;
    }

    // 2. URL pública
    const { data } = supabase.storage
      .from("sponsors")
      .getPublicUrl(fileName);

    const image_url = data.publicUrl;

    // 3. insert DB
    const { error } = await supabase.from("sponsors").insert([
      {
        name,
        description,
        website: website || null,
        image_url,
      },
    ]);

    if (error) {
      console.error(error);
    } else {
      setName("");
      setDescription("");
      setWebsite("");
      setFile(null);
      fetchSponsors();
    }

    setUploading(false);
  };

  // 🗑 DELETE
  const handleDelete = async (id: string, imageUrl: string) => {
    const fileName = imageUrl.split("/").slice(-1)[0];

    await supabase.storage.from("sponsors").remove([fileName]);

    const { error } = await supabase
      .from("sponsors")
      .delete()
      .eq("id", id);

    if (!error) fetchSponsors();
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4">Sponsors</Typography>

      {/* FORM */}
      <Paper sx={{ p: 2, mt: 2 }}>
        <Input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <TextField
          fullWidth
          label="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mt: 2 }}
        />

        <TextField
          fullWidth
          label="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ mt: 2 }}
        />

        <TextField
          fullWidth
          label="Website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          sx={{ mt: 2 }}
        />

        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? "Subiendo..." : "Crear Sponsor"}
        </Button>
      </Paper>

      {/* LISTA */}
      <Grid container spacing={2} sx={{ mt: 3 }}>
        {sponsors.map((s) => (
          <Grid key={s.id}>
            <Paper sx={{ p: 2, position: "relative" }}>
              <img
                src={s.image_url}
                style={{ width: "100%", height: 100, objectFit: "contain" }}
              />

              <Typography>{s.name}</Typography>
              <Typography variant="body2">{s.description}</Typography>

              <IconButton
                onClick={() => handleDelete(s.id, s.image_url)}
                sx={{ position: "absolute", top: 5, right: 5 }}
              >
                <DeleteIcon />
              </IconButton>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AdminSponsors;