import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "leaflet/dist/leaflet.css";
import "aos/dist/aos.css";
import AOS from "aos";

// frontend/src/main.jsx atau App.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "swiper/css"; // ✨ Tambahkan ini! ✨
import "swiper/css/navigation"; // ✨ Jika kamu ingin pakai tombol navigasi ✨
import "swiper/css/pagination"; // ✨ Jika kamu ingin pakai indikator halaman ✨

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const Main = () => {
  useEffect(() => {
    AOS.init({
      once: true, // animasi hanya muncul sekali
      duration: 800, // durasi animasi (ms)
    });
  }, []);

  return <App />;
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Main />
  </StrictMode>
);
