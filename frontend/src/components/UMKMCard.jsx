// frontend/src/components/UMKMCard.jsx
import React from "react";
import { FiEdit2, FiTrash2, FiMapPin } from "react-icons/fi";
import { useNavigate } from "react-router-dom"; // ✨ IMPORT useNavigate ✨
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

const UMKMCard = ({ umkm, isAdmin = false, onEdit, onDelete }) => {
  const navigate = useNavigate(); // ✨ Inisialisasi useNavigate ✨

  const validPhotos = (umkm.photos || []).filter((url) => url);
  const defaultImageUrl = "/images/placeholder-umkm.jpg";
  const displayedPhotos = validPhotos.length > 0 ? validPhotos : [defaultImageUrl];

  // Fungsi untuk menangani klik pada area kartu selain tombol/link internal
  const handleCardClick = () => {
    navigate(`/umkm/${umkm.id}`);
  };

  return (
    // ✨ UBAH INI DARI <Link> MENJADI <div> ✨
    <div
      className="relative rounded-2xl overflow-hidden shadow-lg h-[420px] w-full max-w-xs mx-auto group cursor-pointer" // Tambah cursor-pointer
      onClick={handleCardClick} // ✨ TAMBAHKAN ONCLICK UNTUK NAVIGASI UTAMA ✨
    >
      {/* Ganti tag img dengan Swiper Component */}
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        navigation={true}
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
      <div className="absolute bottom-0 left-0 right-0 p-4 z-20 text-white">
        <h3 className="text-lg font-semibold" style={{ fontFamily: "Poppins, sans-serif" }}>
          {umkm.name}
        </h3>
        <p className="text-xs text-white/80">
          {umkm.category} • {umkm.address}
        </p>

        {/* Baris Aksi */}
        <div className="mt-3 flex gap-2 items-center z-30">
          {/* Tombol Maps (tetap terpisah, dan PASTIKAN stopPropagation) */}
          {umkm.Maps_url && (
            <a
              href={umkm.Maps_url}
              target="_blank"
              rel="noopener noreferrer"
              title="Lihat di Maps"
              onClick={(e) => e.stopPropagation()} // ✨ PENTING: Mencegah klik link juga memicu klik div utama ✨
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition"
            >
              <FiMapPin className="text-[#F59E0B] text-lg" />
            </a>
          )}

          {/* Tombol Admin (PASTIKAN stopPropagation) */}
          {isAdmin && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Mencegah event menyebar ke div utama
                  onEdit(umkm);
                }}
                title="Edit UMKM"
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition"
              >
                <FiEdit2 className="text-white text-lg" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Mencegah event menyebar ke div utama
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
