// frontend/src/components/UMKMCard.jsx
import React from "react";
import { FiMapPin } from "react-icons/fi"; // Kita cuma butuh FiMapPin, yang lain bisa dihapus jika tidak dipakai
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { getCardThumbnail } from "../utils/imageOptimizer";

const UMKMCard = ({ umkm, isAdmin = false, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const validPhotos = (umkm.photos || []).filter((url) => url);
  const defaultImageUrl = "/images/placeholder-umkm.jpg";
  // Optimasi gambar untuk card thumbnail
  const displayedPhotos = validPhotos.length > 0 
    ? validPhotos.map(url => getCardThumbnail(url))
    : [defaultImageUrl];

  const handleCardClick = () => {
    navigate(`/umkm/${umkm.id}`);
  };

  // Kita tambahkan fungsi untuk mengambil nama dusun dari alamat
  const getDusunFromAddress = (address) => {
    const dusunOptions = ["Kalicecep", "Beji Jurang", "Beji Dukuh", "Penanggulan", "Berngosan"];
    for (const dusun of dusunOptions) {
      if (address.toLowerCase().includes(dusun.toLowerCase())) {
        return dusun;
      }
    }
    return "Tidak Dikenali";
  };

  const dusunName = umkm.address ? getDusunFromAddress(umkm.address) : "Tidak Dikenali";

  return (
    // ✨ PERUBAHAN: Container Card sekarang punya tinggi yang lebih fleksibel dan padding ✨
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg w-full max-w-xs mx-auto group cursor-pointer flex flex-col" onClick={handleCardClick}>
      {/* ✨ BAGIAN ATAS: Gambar dan Badge ✨ */}
      <div className="relative h-[250px] w-full overflow-hidden">
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          className="w-full h-full"
        >
          {displayedPhotos.map((photoUrl, index) => (
            <SwiperSlide key={index}>
              <img 
                src={photoUrl} 
                alt={`${umkm.name} - Foto ${index + 1}`} 
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null; // Prevent infinite loop
                  e.target.src = defaultImageUrl;
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Badge Dusun (Kiri Atas) */}
        <div className="absolute top-3 left-3 bg-white/70 backdrop-blur text-gray-900 text-xs font-semibold px-3 py-1 rounded-full z-20">{dusunName}</div>

        {/* Badge Kategori (Kanan Atas) */}
        <div className="absolute top-3 right-3 bg-white/70 backdrop-blur text-gray-900 text-xs font-semibold px-3 py-1 rounded-full z-20">{umkm.category}</div>
      </div>

      {/* ✨ BAGIAN BAWAH: Konten Teks dan Tombol ✨ */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-900 mb-1" style={{ fontFamily: "Poppins, sans-serif" }}>
          {umkm.name}
        </h3>
        <p
          className="text-xs text-gray-500 mb-4 flex-grow" // Tambahkan flex-grow agar tombol terdorong ke bawah
        >
          {umkm.address}
        </p>

        {/* Tombol Lihat Di Google Maps */}
        {umkm.Maps_url && (
          <a
            href={umkm.Maps_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()} // Penting! Agar klik tombol tidak memicu handleCardClick
            className="flex items-center justify-center gap-2 bg-gray-800 text-white font-semibold py-3 px-4 rounded-xl transition hover:bg-gray-700"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            <FiMapPin className="text-white text-base" />
            Lihat Di Google Maps
          </a>
        )}

        {/* Tombol Admin (disembunyikan di sini, bisa kamu tambahkan jika perlu) */}
        {isAdmin && <div className="mt-2 flex gap-2">{/* ... (tombol edit dan delete jika diperlukan) ... */}</div>}
      </div>
    </div>
  );
};

export default UMKMCard;
