// frontend/src/pages/HomePage.jsx
import React, { useState, useEffect, useCallback } from "react"; // Tambahkan useCallback
// Hapus ini: import dataUMKM from "../data/umkm.json";
import UMKMCard from "../components/UMKMCard";
import MapView from "../components/MapView";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const HomePage = () => {
  const [umkmList, setUmkmList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true); // Tambahkan state loading
  const [error, setError] = useState(null); // Tambahkan state error

  // Fungsi untuk mengambil data UMKM dari backend (mirip dengan AdminPage)
  const fetchUMKMs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:3000/umkm"); // Ganti dengan URL backend API-mu
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUmkmList(data);
      console.log("✅ Data UMKM berhasil diambil dari backend untuk HomePage:", data);
    } catch (err) {
      console.error("❌ Gagal mengambil data UMKM untuk HomePage:", err);
      setError("Gagal memuat data UMKM. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }, []); // Dependensi kosong karena tidak ada variabel eksternal yang berubah

  // Efek untuk memuat data saat komponen mount
  useEffect(() => {
    fetchUMKMs(); // Panggil fungsi fetchUMKMs
  }, [fetchUMKMs]); // Tambahkan fetchUMKMs ke dependensi useEffect

  const filteredUMKM = umkmList.filter((umkm) => {
    // ✨ PERUBAHAN DI SINI: gunakan umkm.name dan umkm.category ✨
    const nama = umkm.name || ""; // Gunakan 'name' dari backend
    const kategori = umkm.category || ""; // Gunakan 'category' dari backend
    const cocokNama = nama.toLowerCase().includes(searchTerm.toLowerCase());
    const cocokKategori = selectedCategory === "" || kategori === selectedCategory;
    return cocokNama && cocokKategori;
  });

  return (
    <>
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative h-screen bg-cover bg-center text-white" style={{ backgroundImage: "url('/images/background-umkm.jpg')" }} data-aos="fade-up">
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-center px-4">
          <h1 style={{ fontFamily: "Poppins, sans-serif" }} className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-wide drop-shadow-md mb-4">
            UMKM DESA BEJIARUM
          </h1>

          <p style={{ fontFamily: "Inter, sans-serif" }} className="text-base sm:text-lg max-w-2xl text-white/90">
            Selamat datang di direktori UMKM Desa Bejiarum — temukan dan dukung pelaku usaha lokal dari desa kami.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-6">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-3 py-6 rounded-xl text-center shadow-lg w-32 hover:scale-105 transition-transform duration-300">
              <div className="text-sm font-medium">TOTAL UMKM</div>
              <div className="text-4xl mt-1 font-extrabold leading-none">{loading ? "..." : umkmList.length}</div> {/* Tampilkan loading state */}
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-3 py-6 rounded-xl text-center shadow-lg w-32 hover:scale-105 transition-transform duration-300">
              <div className="text-sm font-medium">KATEGORI</div>
              {/* ✨ PERUBAHAN DI SINI: gunakan umkm.category untuk mendapatkan kategori unik ✨ */}
              <div className="text-4xl mt-1 font-extrabold leading-none">{loading ? "..." : new Set(umkmList.map((item) => item.category)).size}</div> {/* Tampilkan loading state */}
            </div>
          </div>
        </div>
      </section>

      {/* FILTER SECTION */}
      <section className="bg-white py-10 px-4 scroll-mt-16" id="filter" style={{ fontFamily: "Inter, sans-serif" }}>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-4 md:gap-6">
          <input
            type="text"
            placeholder="Cari nama UMKM..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-2/3 border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-1/3 bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            <option value="">Semua Kategori</option>
            {loading ? ( // Tampilkan loading state untuk opsi kategori
              <option>Memuat...</option>
            ) : (
              // ✨ PERUBAHAN DI SINI: buat opsi kategori dinamis dari data UMKM ✨
              [...new Set(umkmList.map((u) => u.category))].map((kategori) => (
                <option key={kategori} value={kategori}>
                  {kategori}
                </option>
              ))
            )}
          </select>
        </div>
      </section>

      {/* CARD GRID SECTION */}
      <section className="bg-gray-100 py-10 px-4" data-aos="fade-up" data-aos-delay="200">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>
            Daftar UMKM
          </h2>

          {loading ? (
            <p className="text-center text-gray-600">Memuat data UMKM...</p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : filteredUMKM.length === 0 ? (
            <p className="text-gray-500 text-center col-span-full">😞 Tidak ada UMKM yang cocok dengan pencarian.</p>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              {filteredUMKM.map((umkm) => (
                // Pastikan key dan props umkm sesuai dengan data dari backend
                <UMKMCard key={umkm.id || umkm.name} umkm={umkm} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* MAP SECTION */}
      <section className="px-4 py-10 bg-white scroll-mt-16" id="peta" data-aos="fade-up" data-aos-delay="200">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-gray-800" style={{ fontFamily: "Poppins, sans-serif" }}>
            Peta UMKM
          </h2>
          {/* Kirim umkmList ke MapView agar peta bisa menampilkan marker UMKM */}
          {/* ✨ PERBAIKAN DI SINI: Pindahkan komentar ke baris terpisah atau gunakan komentar JSX saja ✨ */}
          {loading ? <p className="text-center text-gray-600">Memuat peta...</p> : error ? <p className="text-center text-red-600">Gagal memuat peta.</p> : <MapView umkmList={filteredUMKM} />}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default HomePage;
