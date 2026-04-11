import { useState, useEffect, useRef } from "react";
import { supabase } from "../api/supabaseClient";
import { Box, IconButton, CircularProgress } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

interface CarouselItem {
  id: string;
  url: string;
  alt: string;
  type: "image" | "video";
}

interface CarouselProps {
  pageSlug: string;
}

const Carousel: React.FC<CarouselProps> = ({ pageSlug }) => {
  const [items, setItems] = useState<CarouselItem[]>([]);
  const [current, setCurrent] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const [loading, setLoading] = useState(true);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchItems = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("page_media")
      .select("id, url, alt, type, order_index")
      .eq("page_slug", pageSlug)
      .order("order_index", { ascending: true });

    console.log("PAGE SLUG:", pageSlug);
    console.log("ITEMS:", data);

    if (error) {
      console.error("Error loading media:", error);
      setItems([]);
    } else {
      setItems((data || []) as CarouselItem[]);
      setCurrent(0);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (pageSlug) fetchItems();
  }, [pageSlug]);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + items.length) % items.length);
  };

  useEffect(() => {
    if (items.length === 0 || isInteracting) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const currentItem = items[current];

    if (currentItem?.type === "video") return;

    timeoutRef.current = setTimeout(nextSlide, 3500);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [current, items, isInteracting]);

  if (loading) {
    return (
      <Box
        sx={{
          height: 400,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (items.length === 0) return null;

  return (
    <Box
      onMouseEnter={() => setIsInteracting(true)}
      onMouseLeave={() => setIsInteracting(false)}
      sx={{
        position: "relative",
        width: "100%",
        height: {
        xs: 350, // móviles
        md: 500, // tablets y web
      },
        overflow: "hidden",
      }}
    >
      {/* SLIDES */}
      {items.map((item, i) => (
        <Box
          key={item.id}
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            opacity: i === current ? 1 : 0,
            transition: "opacity 0.5s ease-in-out",
            background:"black"
          }}
        >
          {item.type === "video" ? (
            <video
              src={item.url}
              autoPlay
              muted
              controls
              onEnded={nextSlide}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          ) : (
            <img
              src={item.url}
              alt={item.alt || ""}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          )}
        </Box>
      ))}

      {/* LEFT BUTTON */}
      <IconButton
        onClick={() => {
          setIsInteracting(true);
          prevSlide();
        }}
        sx={{
          position: "absolute",
          top: "50%",
          left: 10,
          transform: "translateY(-50%)",
          backgroundColor: "rgba(0,0,0,0.4)",
          color: "white",
        "&:hover": {
  backgroundColor: "rgba(0,0,0,0.7)",
  transform: "translateY(-50%) scale(1.05)"
}
        }}
      >
        <ChevronLeft />
      </IconButton>

      {/* RIGHT BUTTON */}
      <IconButton
        onClick={() => {
          setIsInteracting(true);
          nextSlide();
        }}
        sx={{
          position: "absolute",
          top: "50%",
          right: 10,
          transform: "translateY(-50%)",
          backgroundColor: "rgba(0,0,0,0.4)",
          color: "white",
       "&:hover": {
  backgroundColor: "rgba(0,0,0,0.7)",
  transform: "translateY(-50%) scale(1.05)"
}
        }}
      >
        <ChevronRight />
      </IconButton>

      {/* DOTS */}
      <Box
        sx={{
          position: "absolute",
          bottom: 10,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          gap: 1,
        }}
      >
        {items.map((_, i) => (
          <Box
            key={i}
            onClick={() => {
              setIsInteracting(true);
              setCurrent(i);
            }}
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              cursor: "pointer",
              backgroundColor: i === current ? "white" : "rgba(255,255,255,0.4)",
              transition: "0.3s",
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Carousel;