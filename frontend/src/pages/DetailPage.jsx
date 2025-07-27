// frontend/src/pages/DetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FiArrowLeft, FiMapPin, FiPhone, FiInfo, FiClock, FiUser } from "react-icons/fi"; // Tambahkan ikon FiClock, FiUser

// ✨ Import Swiper React components ✨
import { Swiper, SwiperSlide } from "swiper/react";
// ✨ Import Swiper modules ✨
import { Autoplay, Pagination, Navigation } from "swiper/modules";
// Pastikan CSS Swiper diimpor di main.jsx atau App.jsx
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';

const DetailPage = () => {
  const { id } = useParams();
  const [umkm, setUmkm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUMKMDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:3000/umkm/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUmkm(data);
        console.log("✅ Data UMKM detail berhasil diambil:", data);
      } catch (err) {
        console.error("❌ Gagal mengambil detail UMKM:", err);
        setError("Gagal memuat detail UMKM. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUMKMDetail();
    }
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <section className="pt-24 px-4 py-10 min-h-screen flex items-center justify-center bg-gray-50">
          <p className="text-center text-gray-600">Memuat detail UMKM...</p>
        </section>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <section className="pt-24 px-4 py-10 min-h-screen flex flex-col items-center justify-center bg-gray-50">
          <p className="text-center text-red-600">{error}</p>
          <Link to="/" className="mt-4 text-blue-500 hover:underline">
            Kembali ke Beranda
          </Link>
        </section>
        <Footer />
      </>
    );
  }

  if (!umkm) {
    return (
      <>
        <Navbar />
        <section className="pt-24 px-4 py-10 min-h-screen flex flex-col items-center justify-center bg-gray-50">
          <p className="text-center text-gray-500">UMKM tidak ditemukan.</p>
          <Link to="/" className="mt-4 text-blue-500 hover:underline">
            Kembali ke Beranda
          </Link>
        </section>
        <Footer />
      </>
    );
  }

  // Filter out null/undefined photo URLs and provide a placeholder if needed
  const validPhotos = (umkm.photos || []).filter((url) => url);
  const displayedPhotos = validPhotos.length > 0 ? validPhotos : ["/images/placeholder-umkm.jpg"]; // Pastikan path placeholder benar

  return (
    <>
      <Navbar />
      <section className="pt-24 px-4 py-10 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Header & Gambar (Menggunakan Swiper) */}
          <div className="relative h-80">
            {" "}
            {/* Tinggi tetap untuk carousel */}
            {displayedPhotos.length > 0 ? (
              <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                spaceBetween={0}
                slidesPerView={1}
                autoplay={{
                  delay: 3500, // Geser setiap 3.5 detik
                  disableOnInteraction: false,
                }}
                pagination={{ clickable: true }}
                navigation={true}
                className="w-full h-full"
              >
                {displayedPhotos.map((photoUrl, index) => (
                  <SwiperSlide key={index}>
                    <img src={photoUrl} alt={`${umkm.name} - Foto ${index + 1}`} className="w-full h-full object-cover" />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              // Jika tidak ada foto sama sekali
              <img src="/images/placeholder-umkm.jpg" alt="No image available" className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-black/40 flex items-end p-6 z-10">
              {" "}
              {/* z-index lebih tinggi dari Swiper */}
              <h1 className="text-4xl font-extrabold text-white drop-shadow-lg" style={{ fontFamily: "Poppins, sans-serif" }}>
                {umkm.name}
              </h1>
            </div>
            <Link to="/" className="absolute top-4 left-4 text-white text-3xl p-2 rounded-full bg-black/50 hover:bg-black/70 transition z-20">
              {" "}
              {/* z-index lebih tinggi */}
              <FiArrowLeft />
            </Link>
          </div>

          {/* Detail Info */}
          <div className="p-6">
            <p className="text-sm text-gray-600 mb-4 flex items-center gap-2">
              <FiInfo className="text-lg text-gray-500" />
              {umkm.category}
            </p>
            {umkm.owner_name && (
              <p className="text-sm text-gray-600 mb-4 flex items-center gap-2">
                <FiUser className="text-lg text-gray-500" />
                Pemilik: {umkm.owner_name}
              </p>
            )}

            <h2 className="text-xl font-bold text-gray-800 mb-3">Deskripsi</h2>
            <p className="text-gray-700 leading-relaxed mb-6">{umkm.description || "Deskripsi belum tersedia."}</p>

            <h2 className="text-xl font-bold text-gray-800 mb-3">Informasi Kontak & Lokasi</h2>
            <div className="space-y-3 mb-6">
              {umkm.address && (
                <p className="flex items-center gap-2 text-gray-700">
                  <FiMapPin className="text-lg text-blue-500" />
                  {umkm.address}
                </p>
              )}
              {umkm.kontak && ( // Jika ada field kontak (pastikan ini ada di DB atau hapus)
                <p className="flex items-center gap-2 text-gray-700">
                  <FiPhone className="text-lg text-green-500" />
                  {umkm.kontak}
                </p>
              )}
              {umkm.jam_buka &&
                umkm.jam_tutup && ( // Jika ada field jam_buka dan jam_tutup (pastikan ini ada di DB atau hapus)
                  <p className="flex items-center gap-2 text-gray-700">
                    <FiClock className="text-lg text-purple-500" />
                    Jam Buka: {umkm.jam_buka} - {umkm.jam_tutup}
                  </p>
                )}
            </div>

            {umkm.Maps_url && (
              <div className="mt-4">
                <a href={umkm.Maps_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-base font-medium rounded-lg hover:bg-blue-700 transition">
                  <FiMapPin className="mr-2" /> Lihat di Google Maps
                </a>
              </div>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default DetailPage;
