// frontend/src/components/UMKMCard.jsx
import React from "react";
import { FiEdit2, FiTrash2, FiMapPin } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

const UMKMCard = ({ umkm, isAdmin = false, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const validPhotos = (umkm.photos || []).filter((url) => url);
  const defaultImageUrl = "/images/placeholder-umkm.jpg";
  const displayedPhotos = validPhotos.length > 0 ? validPhotos : [defaultImageUrl];

  const handleCardClick = () => {
    navigate(`/umkm/${umkm.id}`);
  };

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-lg h-[420px] w-full max-w-xs mx-auto group cursor-pointer" onClick={handleCardClick}>
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        className="w-full h-full absolute inset-0"
      >
        {displayedPhotos.map((photoUrl, index) => (
          <SwiperSlide key={index}>
            <img src={photoUrl} alt={`${umkm.name} - Foto ${index + 1}`} className="absolute inset-0 w-full h-full object-cover" />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Gradasi Bawah */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* Konten Teks */}
      {/* ✨ PERBAIKAN DI SINI: tambahkan flex-col dan justify-end untuk penempatan konten yang lebih baik ✨ */}
      {/* ✨ Dan tambahkan tinggi minimum untuk memastikan ada ruang bagi teks ✨ */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-20 text-white flex flex-col justify-end min-h-[120px]">
        <h3
          className="text-lg font-semibold mb-1"
          style={{ fontFamily: "Poppins, sans-serif" }}
          // ✨ TAMBAHKAN CLASS UNTUK PENANGANAN TEKS PANJANG ✨
          // Jika menggunakan Tailwind CSS v3+, pastikan plugin @tailwindcss/line-clamp sudah diinstal
          // dan diaktifkan di tailwind.config.js
          // Contoh: plugins: [require('@tailwindcss/line-clamp')],
          // Jika tidak, Anda bisa menggunakan CSS biasa untuk text-overflow: ellipsis;
          // className="line-clamp-2" // Memotong teks jadi 2 baris jika terlalu panjang
        >
          {umkm.name}
        </h3>
        <p
          className="text-xs text-white/80 mb-2"
          // ✨ TAMBAHKAN CLASS UNTUK PENANGANAN TEKS PANJANG ✨
          // className="line-clamp-2" // Memotong teks jadi 2 baris jika terlalu panjang
        >
          {umkm.category} • {umkm.address}
        </p>

        {/* Baris Aksi */}
        {/* ✨ Tambahkan mt-auto untuk mendorong tombol ke bawah jika teks pendek ✨ */}
        <div className="mt-auto flex gap-2 items-center z-30">
          {umkm.Maps_url && (
            <a href={umkm.Maps_url} target="_blank" rel="noopener noreferrer" title="Lihat di Maps" onClick={(e) => e.stopPropagation()} className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition">
              <FiMapPin className="text-[#F59E0B] text-lg" />
            </a>
          )}

          {isAdmin && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(umkm);
                }}
                title="Edit UMKM"
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition"
              >
                <FiEdit2 className="text-white text-lg" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
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
    </div>
  );
};

export default UMKMCard;
