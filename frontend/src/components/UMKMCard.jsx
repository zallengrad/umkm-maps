// frontend/src/components/UMKMCard.jsx
import React from "react";
import { FiEdit2, FiTrash2, FiMapPin } from "react-icons/fi";
import { Link } from "react-router-dom"; // ✨ IMPORT LINK ✨

const UMKMCard = ({ umkm, isAdmin = false, onEdit, onDelete }) => {
  const imageUrl = umkm.photos && umkm.photos.length > 0 ? umkm.photos[0] : "/images/placeholder-umkm.jpg"; // Ganti dengan placeholder jika perlu

  return (
    // ✨ BUNGKUS DENGAN LINK AGAR KARTU BISA DIKLIK ✨
    <Link to={`/umkm/${umkm.id}`} className="block relative rounded-2xl overflow-hidden shadow-lg h-[420px] w-full max-w-xs mx-auto group">
      {/* Gambar */}
      <img src={imageUrl} alt={umkm.name} className="absolute inset-0 w-full h-full object-cover" />

      {/* Gradasi Bawah */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* Konten Teks */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10 text-white">
        <h3 className="text-lg font-semibold" style={{ fontFamily: "Poppins, sans-serif" }}>
          {umkm.name}
        </h3>
        <p className="text-xs text-white/80">
          {umkm.category} • {umkm.address}
        </p>

        {/* Baris Aksi */}
        <div className="mt-3 flex gap-2 items-center">
          {/* Tombol Maps (tetap terpisah jika tidak ingin klik kartu mengarah ke maps) */}
          {umkm.Maps_url && (
            <a
              href={umkm.Maps_url}
              target="_blank"
              rel="noopener noreferrer"
              title="Lihat di Maps"
              onClick={(e) => e.stopPropagation()} // ✨ PENTING: Mencegah klik link juga memicu klik kartu ✨
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition"
            >
              <FiMapPin className="text-[#F59E0B] text-lg" />
            </a>
          )}

          {/* Tombol Admin */}
          {isAdmin && (
            <>
              <button
                onClick={(e) => {
                  e.preventDefault(); // ✨ PENTING: Mencegah klik tombol juga memicu klik kartu ✨
                  e.stopPropagation(); // Mencegah event menyebar ke parent Link
                  onEdit(umkm);
                }}
                title="Edit UMKM"
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition"
              >
                <FiEdit2 className="text-white text-lg" />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault(); // ✨ PENTING: Mencegah klik tombol juga memicu klik kartu ✨
                  e.stopPropagation(); // Mencegah event menyebar ke parent Link
                  onDelete(umkm.id);
                }}
                title="Hapus UMKM"
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition"
              >
                <FiTrash2 className="text-red-400 text-lg" />
              </button>
            </>
          )}
        </div>
      </div>
    </Link> // ✨ AKHIR DARI LINK ✨
  );
};

export default UMKMCard;
