import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "leaflet/dist/leaflet.css";
import "aos/dist/aos.css";
import AOS from "aos";

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
