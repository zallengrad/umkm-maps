import React from "react";
import { FiEdit2, FiTrash2, FiMapPin } from "react-icons/fi";

const UMKMCard = ({ umkm, isAdmin = false, onEdit, onDelete }) => {
  return (
    <div className="relative rounded-2xl overflow-hidden shadow-lg h-[420px] w-full max-w-xs mx-auto group">
      {/* Gambar */}
      <img src={umkm.foto} alt={umkm.nama} className="absolute inset-0 w-full h-full object-cover" />

      {/* Gradasi Bawah */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* Konten Teks */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10 text-white">
        <h3 className="text-lg font-semibold" style={{ fontFamily: "Poppins, sans-serif" }}>
          {umkm.nama}
        </h3>
        <p className="text-xs text-white/80">
          {umkm.kategori} • {umkm.alamat}
        </p>

        {/* Baris Aksi */}
        <div className="mt-3 flex gap-2 items-center">
          {/* Tombol Maps */}
          <a href={umkm.link_maps} target="_blank" rel="noopener noreferrer" title="Lihat di Maps" className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition">
            <FiMapPin className="text-[#F59E0B] text-lg" />
          </a>

          {/* Tombol Admin */}
          {isAdmin && (
            <>
              <button onClick={() => onEdit(umkm)} title="Edit UMKM" className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition">
                <FiEdit2 className="text-white text-lg" />
              </button>
              <button onClick={() => onDelete(umkm.id)} title="Hapus UMKM" className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition">
                <FiTrash2 className="text-red-400 text-lg" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UMKMCard;
