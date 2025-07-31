// frontend/src/pages/AdminPage.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import UMKMCard from "../components/UMKMCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ModalEditUMKM from "../components/ModalEditUMKM";
import ModalTambahUMKM from "../components/ModalTambahUMKM";
import ModalConfirmDelete from "../components/ModalConfirmDelete";
import { API_BASE_URL } from "../utils/apiConfig";

// DAFTAR KATEGORI UMKM YANG LENGKAP (tetap sama)
const UMKM_CATEGORIES = [
  "Kuliner",
  "Jasa",
  "Kerajinan / Handmade",
  "Perdagangan (Retail/Reseller)",
  "Digital / Kreatif",
  "Pertanian",
  "Perikanan & Peternakan",
  "Kosmetik & Herbal",
  "Mainan & Edukasi Anak",
  "Manufaktur Rumahan",
  "Lain nya",
];

// ✨ DAFTAR DUSUN DI DESA BEJIARUM (Sama dengan di modal) ✨
const DUSUN_OPTIONS = [
  "", // Opsi default "Semua Dusun"
  "Kalicecep",
  "Beji Jurang",
  "Beji Dukuh",
  "Penanggulan",
  "Berngosan",
];

const AdminPage = () => {
  const [umkmList, setUmkmList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  // ✨ STATE BARU UNTUK FILTER DUSUN ✨
  const [selectedDusun, setSelectedDusun] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUMKM, setSelectedUMKM] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [umkmToDelete, setUmkmToDelete] = useState(null);

  const [showLogoutConfirmModal, setShowLogoutConfirmModal] = useState(false);

  const fetchUMKMs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/umkm`);
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
    const isLoggedIn = localStorage.getItem("isLoggedIn") || sessionStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      fetchUMKMs();
    }
  }, [navigate, fetchUMKMs]);

  const filteredUMKM = umkmList.filter((umkm) => {
    const nama = umkm.name || "";
    const kategori = umkm.category || "";
    const address = umkm.address || ""; // Ambil alamat dari UMKM

    // ✨ LOGIKA BARU UNTUK FILTER DUSUN ✨
    let cocokDusun = true;
    if (selectedDusun !== "") {
      // Coba cek apakah string alamat mengandung nama dusun yang dipilih
      cocokDusun = address.toLowerCase().includes(selectedDusun.toLowerCase());
    }

    const cocokNama = nama.toLowerCase().includes(searchTerm.toLowerCase());
    const cocokKategori = selectedCategory === "" || kategori === selectedCategory;

    return cocokNama && cocokKategori && cocokDusun; // ✨ TAMBAHKAN KONDISI DUSUN ✨
  });

  const handleEdit = (umkm) => {
    setSelectedUMKM(umkm);
    setShowEditModal(true);
  };

  const handleSaveEdit = async (updatedUMKM) => {
    try {
      const response = await fetch(`${API_BASE_URL}/umkm/${updatedUMKM.id}`, {
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

  const handleDelete = (umkmId) => {
    const umkmToConfirm = umkmList.find((umkm) => umkm.id === umkmId);
    if (umkmToConfirm) {
      setUmkmToDelete(umkmToConfirm);
      setShowDeleteConfirmModal(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!umkmToDelete) return;

    try {
      const response = await fetch(`${API_BASE_URL}/umkm/${umkmToDelete.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log("✅ UMKM berhasil dihapus dari backend.");
      await fetchUMKMs();
      setShowDeleteConfirmModal(false);
      setUmkmToDelete(null);
    } catch (err) {
      console.error("❌ Gagal menghapus UMKM:", err);
      alert("Gagal menghapus UMKM: " + err.message);
      setShowDeleteConfirmModal(false);
      setUmkmToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmModal(false);
    setUmkmToDelete(null);
  };

  const handleAddUMKM = async (newUMKMFromBackend) => {
    await fetchUMKMs();
    setShowAddModal(false);
  };

  const handleLogoutAttempt = () => {
    setShowLogoutConfirmModal(true);
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("isLoggedIn");
    navigate("/login");
    setShowLogoutConfirmModal(false);
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirmModal(false);
  };

  const categoriesWithData = new Set(umkmList.map((u) => u.category));

  return (
    <>
      <Navbar onLogoutClick={handleLogoutAttempt} />

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
              <div className="text-4xl font-bold">{loading ? "..." : categoriesWithData.size}</div>
            </div>
          </div>

          {/* Baris 2: Semua kategori */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Kategori UMKM</h3>
            <div className="flex flex-wrap gap-2">
              {loading ? (
                <p>Memuat kategori...</p>
              ) : (
                UMKM_CATEGORIES.map((kategori) => {
                  const hasData = categoriesWithData.has(kategori);
                  const categoryClass = hasData ? "bg-green-200 text-green-800" : "bg-gray-200 text-gray-800";
                  return (
                    <span key={kategori} className={`${categoryClass} px-3 py-1 rounded-full text-sm font-medium`}>
                      {kategori}
                    </span>
                  );
                })
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
              className="w-full md:w-1/3 border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 transition" // Sesuaikan lebar
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full md:w-1/3 bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition" // Sesuaikan lebar
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              <option value="">Semua Kategori</option>
              {UMKM_CATEGORIES.map((kategori) => (
                <option key={kategori} value={kategori}>
                  {kategori}
                </option>
              ))}
            </select>

            {/* ✨ SELECT BARU UNTUK FILTER DUSUN ✨ */}
            <select
              value={selectedDusun}
              onChange={(e) => setSelectedDusun(e.target.value)}
              className="w-full md:w-1/3 bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition" // Sesuaikan lebar
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              <option value="">Semua Dusun</option>
              {DUSUN_OPTIONS.filter((d) => d !== "").map(
                (
                  dusun // Filter default option
                ) => (
                  <option key={dusun} value={dusun}>
                    {dusun}
                  </option>
                )
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

      {/* MODAL KONFIRMASI DELETE */}
      {showDeleteConfirmModal && umkmToDelete && <ModalConfirmDelete itemName={umkmToDelete.name} onConfirm={handleConfirmDelete} onCancel={handleCancelDelete} />}

      {/* MODAL KONFIRMASI LOGOUT */}
      {showLogoutConfirmModal && <ModalConfirmDelete itemName="keluar dari Dashboard Admin" onConfirm={handleConfirmLogout} onCancel={handleCancelLogout} />}
    </>
  );
};

export default AdminPage;
