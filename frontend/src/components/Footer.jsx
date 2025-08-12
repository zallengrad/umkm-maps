// frontend/src/components/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white text-center py-6 mt-10">
      <div className="text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
        {/* ✨ PERUBAHAN DI SINI: Memecah teks untuk tampilan mobile ✨ */}
        <p>© 2025 UMKM Bejiarum.</p>
        <p className="mt-1">Di antara lereng dan ladang, 🌄 kami tumbuh bersama harapan.</p>
        <p className="mt-1">– KKN UIN Sunan Kalijaga ❤️</p>
      </div>
    </footer>
  );
};

export default Footer;
