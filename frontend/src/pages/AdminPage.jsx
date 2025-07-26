// frontend/src/pages/AdminPage.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import UMKMCard from "../components/UMKMCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ModalEditUMKM from "../components/ModalEditUMKM";
import ModalTambahUMKM from "../components/ModalTambahUMKM";

const AdminPage = () => {
  const [umkmList, setUmkmList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUMKM, setSelectedUMKM] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchUMKMs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:3000/umkm");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUmkmList(data);
      console.log("✅ Data UMKM berhasil diambil dari backend:", data);
    } catch (err) {
      console.error("❌ Gagal mengambil data UMKM dari backend:", err);
      setError("Gagal memuat data UMKM. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      fetchUMKMs();
    }
  }, [navigate, fetchUMKMs]);

  const filteredUMKM = umkmList.filter((umkm) => {
    // ✨ PERUBAHAN DI SINI: gunakan umkm.name untuk nama UMKM ✨
    const nama = umkm.name || "";
    const kategori = umkm.category || "";
    const cocokNama = nama.toLowerCase().includes(searchTerm.toLowerCase());
    const cocokKategori = selectedCategory === "" || kategori === selectedCategory;
    return cocokNama && cocokKategori;
  });

  const handleEdit = (umkm) => {
    setSelectedUMKM(umkm);
    setShowEditModal(true);
  };

  const handleSaveEdit = async (updatedUMKM) => {
    try {
      const response = await fetch(`http://localhost:3000/umkm/${updatedUMKM.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUMKM),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await fetchUMKMs();
      setShowEditModal(false);
    } catch (err) {
      console.error("❌ Gagal update UMKM:", err);
      alert("Gagal mengupdate UMKM: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Yakin ingin menghapus UMKM ini?");
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:3000/umkm/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        await fetchUMKMs();
      } catch (err) {
        console.error("❌ Gagal menghapus UMKM:", err);
        alert("Gagal menghapus UMKM: " + err.message);
      }
    }
  };

  const handleAddUMKM = async (newUMKMFromBackend) => {
    await fetchUMKMs();
    setShowAddModal(false);
  };

  return (
    <>
      <Navbar />

      {/* ADMIN DASHBOARD HEADER */}
      <section className="pt-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6" style={{ fontFamily: "Poppins, sans-serif" }}>
            Dashboard Admin
          </h1>

          {/* Baris 1: Total UMKM */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-yellow-100 text-yellow-800 px-4 py-4 rounded-lg shadow-sm text-center">
              <div className="text-sm font-medium">Total UMKM</div>
              <div className="text-4xl font-bold">{loading ? "..." : umkmList.length}</div>
            </div>
            <div className="bg-blue-100 text-blue-800 px-4 py-4 rounded-lg shadow-sm text-center">
              <div className="text-sm font-medium">Jumlah Kategori</div>
              <div className="text-4xl font-bold">{loading ? "..." : new Set(umkmList.map((u) => u.category)).size}</div>
            </div>
          </div>

          {/* Baris 2: Semua kategori */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Kategori UMKM</h3>
            <div className="flex flex-wrap gap-2">
              {loading ? (
                <p>Memuat kategori...</p>
              ) : (
                // ✨ PERUBAHAN DI SINI: gunakan umkm.category untuk mendapatkan kategori unik ✨
                [...new Set(umkmList.map((u) => u.category))].map((kategori) => (
                  <span key={kategori} className="bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded-full">
                    {kategori}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Filter pencarian */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
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
              {loading ? (
                <option>Memuat...</option>
              ) : (
                // ✨ PERUBAHAN DI SINI: gunakan umkm.category untuk mendapatkan kategori unik ✨
                [...new Set(umkmList.map((u) => u.category))].map((kategori) => (
                  <option key={kategori} value={kategori}>
                    {kategori}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>
      </section>

      {/* ADMIN CARD LIST */}
      <section className="bg-gray-50 px-4 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800" style={{ fontFamily: "Poppins, sans-serif" }}>
              Data UMKM
            </h2>
            <button onClick={() => setShowAddModal(true)} className="bg-green-600 text-white text-sm font-medium px-4 py-2 rounded hover:bg-green-700">
              + Tambah UMKM
            </button>
          </div>

          {loading ? (
            <p className="text-center text-gray-600">Memuat data UMKM...</p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : filteredUMKM.length === 0 ? (
            <p className="text-gray-500 text-center col-span-full">Tidak ada data yang cocok.</p>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              {filteredUMKM.map((umkm) => (
                <UMKMCard key={umkm.id || umkm.name} umkm={umkm} isAdmin={true} onEdit={handleEdit} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />

      {/* Modal Edit */}
      {showEditModal && selectedUMKM && <ModalEditUMKM umkm={selectedUMKM} onClose={() => setShowEditModal(false)} onSave={handleSaveEdit} />}

      {/* Modal Tambah */}
      {showAddModal && <ModalTambahUMKM onClose={() => setShowAddModal(false)} onSubmit={handleAddUMKM} />}
    </>
  );
};

export default AdminPage;
