import { useEffect, useState } from "react";
import { supabase } from "../api/supabaseClient";

import {
  Box,
  Typography,
  TextField,
  Button,
  Input,
} from "@mui/material";

const ABOUT_ID = "00000000-0000-0000-0000-000000000001";

export default function AdminAboutUs() {
  const [instalacionesText, setInstalacionesText] = useState("");
  const [ownerText, setOwnerText] = useState("");

  const [ownerImageUrl, setOwnerImageUrl] = useState("");
  const [ownerImagePath, setOwnerImagePath] = useState("");

  const [mainImageUrl, setMainImageUrl] = useState("");
  const [mainImagePath, setMainImagePath] = useState("");

  const [ownerFile, setOwnerFile] = useState<File | null>(null);
  const [mainFile, setMainFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // -------------------------
  // LOAD
  // -------------------------
  const fetchData = async () => {
    const { data, error } = await supabase
      .from("about_us")
      .select("*")
      .eq("id", ABOUT_ID)
      .single();

    if (!error && data) {
      setInstalacionesText(data.instalaciones_text || "");
      setOwnerText(data.owner_text || "");

      setOwnerImageUrl(data.owner_image_url || "");
      setOwnerImagePath(data.owner_image_path || "");

      setMainImageUrl(data.main_image_url || "");
      setMainImagePath(data.main_image_path || "");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // -------------------------
  // UPLOAD GENERICO
  // -------------------------
  const uploadImage = async (file: File, previousPath?: string) => {
    if (!file) return null;

    // borrar anterior SOLO si existe
    if (previousPath && previousPath.length > 0) {
      await supabase.storage
        .from("pages")
        .remove([previousPath]);
    }

    const fileName = `about-us/${Date.now()}_${file.name}`;

    const { data, error } = await supabase.storage
      .from("pages")
      .upload(fileName, file);

    if (error) {
      console.error(error);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from("pages")
      .getPublicUrl(data.path);

    return {
      url: `${urlData.publicUrl}?t=${Date.now()}`, // cache busting
      path: data.path,
    };
  };

  // -------------------------
  // SAVE
  // -------------------------
  const handleSave = async () => {
    setLoading(true);

    let finalOwnerUrl = ownerImageUrl;
    let finalOwnerPath = ownerImagePath;

    let finalMainUrl = mainImageUrl;
    let finalMainPath = mainImagePath;

    // OWNER IMAGE
    if (ownerFile) {
      const uploaded = await uploadImage(ownerFile, ownerImagePath);

      if (uploaded) {
        finalOwnerUrl = uploaded.url;
        finalOwnerPath = uploaded.path;

        // update UI instantly
        setOwnerImageUrl(uploaded.url);
        setOwnerImagePath(uploaded.path);
      }
    }

    // MAIN IMAGE
    if (mainFile) {
      const uploaded = await uploadImage(mainFile, mainImagePath);

      if (uploaded) {
        finalMainUrl = uploaded.url;
        finalMainPath = uploaded.path;

        // update UI instantly
        setMainImageUrl(uploaded.url);
        setMainImagePath(uploaded.path);
      }
    }

    const { error } = await supabase
      .from("about_us")
      .upsert(
        {
          id: ABOUT_ID,
          instalaciones_text: instalacionesText,
          owner_text: ownerText,

          owner_image_url: finalOwnerUrl,
          owner_image_path: finalOwnerPath,

          main_image_url: finalMainUrl,
          main_image_path: finalMainPath,

          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

    if (error) {
      console.error(error);
      setMessage("Error guardando ❌");
    } else {
      setMessage("Guardado correctamente ✅");
    }

    setLoading(false);
  };

  return (
    <Box sx={{ p: 4, maxWidth: 1000 }}>

      <Typography variant="h4" sx={{ mb: 4 }}>
        Admin Quiénes Somos
      </Typography>

      {/* IMAGEN INSTALACIONES */}
      <Typography variant="h6" sx={{ mb: 1 }}>
        Imagen instalaciones (carrusel principal)
      </Typography>

      <Input
        type="file"
        onChange={(e) => {
          const target = e.target as HTMLInputElement;
          setMainFile(target.files?.[0] || null);
        }}
      />

      {mainImageUrl && (
        <Box
          component="img"
          src={mainImageUrl}
          sx={{
            width: "100%",
            maxWidth: 500,
            mt: 2,
            borderRadius: 2,
          }}
        />
      )}

      {/* TEXTO INSTALACIONES */}
      <Typography variant="h6" sx={{ mt: 5, mb: 1 }}>
        Texto instalaciones
      </Typography>

      <TextField
        multiline
        minRows={6}
        fullWidth
        value={instalacionesText}
        onChange={(e) =>
          setInstalacionesText(e.target.value)
        }
      />

      {/* TEXTO OWNER */}
      <Typography variant="h6" sx={{ mt: 5, mb: 1 }}>
        Texto dueño
      </Typography>

      <TextField
        multiline
        minRows={6}
        fullWidth
        value={ownerText}
        onChange={(e) =>
          setOwnerText(e.target.value)
        }
      />

      {/* FOTO OWNER */}
      <Typography variant="h6" sx={{ mt: 5, mb: 1 }}>
        Foto dueño
      </Typography>

      <Input
        type="file"
        onChange={(e) => {
          const target = e.target as HTMLInputElement;
          setOwnerFile(target.files?.[0] || null);
        }}
      />

      {ownerImageUrl && (
        <Box
          component="img"
          src={ownerImageUrl}
          sx={{
            width: 250,
            mt: 3,
            borderRadius: 2,
          }}
        />
      )}

      {/* SAVE */}
      <Button
        variant="contained"
        sx={{ mt: 5 }}
        onClick={handleSave}
        disabled={loading}
      >
        {loading ? "Guardando..." : "Guardar"}
      </Button>

      {message && (
        <Typography sx={{ mt: 2 }}>
          {message}
        </Typography>
      )}
    </Box>
  );
}