import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#F59E0B] text-white text-center py-6 mt-10">
      <div className="text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
        © {new Date().getFullYear()} UMKM Desa Bejiarum. Dibangun dengan ❤️ untuk masyarakat.
      </div>
    </footer>
  );
};

export default Footer;
