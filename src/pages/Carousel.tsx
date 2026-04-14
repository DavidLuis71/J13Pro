import { useState, useEffect, useRef } from "react";
import { supabase } from "../api/supabaseClient";
import basketball from "../assets/basketball.png";

interface HeroImage {
  url: string;
  alt: string;
}

const Carousel: React.FC = () => {
  const [images, setImages] = useState<HeroImage[]>([]);
  const [current, setCurrent] = useState<number>(0);
 const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const fetchImages = async () => {
    const { data, error } = await supabase
      .from("carousel_images")
      .select("url, alt")
      .order("order_index", { ascending: true });

    if (error) {
      console.error("Error fetching carousel images:", error);
    } else {
      setImages(data || []);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const isVideo = (url: string) => {
    return url.match(/\.(mp4|webm|ogg)$/i);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  // Manejo automático del cambio
  useEffect(() => {
    if (images.length === 0) return;

    // Limpiamos timeout anterior
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const currentImage = images[current];

    if (isVideo(currentImage.url)) {
      // Si es video, no hacemos timeout; dejamos que onEnded lo maneje
      return;
    } else {
      // Si es imagen, cambiamos después de 3s
      timeoutRef.current = setTimeout(nextSlide, 3000);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [current, images]);

if (images.length === 0) {

  return (
    <div
      style={{
        height: "400px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000",
      }}
    >
      <img
        src={basketball}
        alt="Cargando"
        style={{
          width: "80px",
          height: "80px",
          animation: "ballBounce 0.8s infinite alternate",
        }}
      />
    </div>
  );
}

  return (
    <div className="hero-carousel">
      {images.map((img, i) =>
        i === current ? (
          isVideo(img.url) ? (
            <video
              key={i}
              ref={videoRef}
              src={img.url}
              className="active"
              autoPlay
              muted
              onEnded={nextSlide} // Avanza cuando termine el video
            />
          ) : (
            <img key={i} src={img.url} alt={img.alt} className="active" />
          )
        ) : null
      )}

      {/* Flechas */}
      <button className="prev" onClick={prevSlide}>
        ‹
      </button>
      <button className="next" onClick={nextSlide}>
        ›
      </button>

      {/* Dots */}
      <div className="dots">
        {images.map((_, i) => (
          <span
            key={i}
            className={i === current ? "dot active-dot" : "dot"}
            onClick={() => setCurrent(i)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Carousel;