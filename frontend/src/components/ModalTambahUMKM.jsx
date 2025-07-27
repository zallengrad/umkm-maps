// frontend/src/components/ModalTambahUMKM.jsx
import React, { useState, useEffect } from "react";
import { uploadToSupabase } from "../utils/uploadToSupabase";
import { supabase } from "../utils/supabaseClient";
// Tidak perlu lagi extractLatLngFromGoogleMapsUrl di frontend karena backend yang akan melakukan ini
// import { extractLatLngFromGoogleMapsUrl } from "../utils/googleMapsParser";
import { FiCheckCircle, FiAlertCircle, FiLoader } from "react-icons/fi"; // Tambahkan ikon FiLoader

const ModalTambahUMKM = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    address: "",
    latitude: "",
    longitude: "",
    description: "",
    Maps_url: "",
  });

  const [fotoProdukFile, setFotoProdukFile] = useState(null);
  const [previewFotoProduk, setPreviewFotoProduk] = useState("");

  const [fotoPemilikFile, setFotoPemilikFile] = useState(null);
  const [previewFotoPemilik, setPreviewFotoPemilik] = useState("");

  const [fotoBebasFile, setFotoBebasFile] = useState(null);
  const [previewFotoBebas, setPreviewFotoBebas] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState("");
  // State baru untuk feedback Lat/Lng
  const [latLngStatus, setLatLngStatus] = useState("idle"); // 'idle', 'loading', 'success', 'error'

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    getUser();
  }, []);

  const handleChange = async (e) => {
    // ✨ UBAH INI JADI ASYNC ✨
    const { name, value, files } = e.target;

    if (files && files.length > 0) {
      const file = files[0];
      const previewURL = URL.createObjectURL(file);
      switch (name) {
        case "fotoProduk":
          setFotoProdukFile(file);
          setPreviewFotoProduk(previewURL);
          break;
        case "fotoPemilik":
          setFotoPemilikFile(file);
          setPreviewFotoPemilik(previewURL);
          break;
        case "fotoBebas":
          setFotoBebasFile(file);
          setPreviewFotoBebas(previewURL);
          break;
        default:
          break;
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));

      // LOGIKA BARU UNTUK AUTO-POPULATE DARI LINK MAPS
      if (name === "Maps_url") {
        if (value.trim() === "") {
          // Jika input kosong
          setFormData((prev) => ({
            ...prev,
            latitude: "",
            longitude: "",
          }));
          setLatLngStatus("idle");
          return;
        }

        setLatLngStatus("loading"); // Set status loading
        try {
          // Panggil API backend untuk meresolve URL
          const response = await fetch(`http://localhost:3000/api/maps/resolve?url=${encodeURIComponent(value)}`);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          if (data.lat && data.lng) {
            setFormData((prev) => ({
              ...prev,
              latitude: data.lat.toString(),
              longitude: data.lng.toString(),
            }));
            setLatLngStatus("success"); // Set status sukses
            // Opsional: Perbarui Maps_url dengan URL panjang jika diinginkan
            setFormData((prev) => ({ ...prev, Maps_url: data.longUrl || value }));
          } else {
            throw new Error("Koordinat tidak ditemukan di URL ini.");
          }
        } catch (error) {
          console.error("Gagal mengekstrak koordinat:", error);
          setFormData((prev) => ({
            ...prev,
            latitude: "",
            longitude: "",
          }));
          setLatLngStatus("error"); // Set status error
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    let photoUrls = [];

    try {
      // Validasi tambahan: Pastikan lat & lng terisi jika URL Maps diisi
      if (formData.Maps_url && (isNaN(parseFloat(formData.latitude)) || isNaN(parseFloat(formData.longitude)))) {
        throw new Error("Koordinat Latitude atau Longitude tidak valid dari URL Google Maps. Pastikan URL Maps benar.");
      }

      if (fotoProdukFile) {
        const url = await uploadToSupabase(fotoProdukFile);
        photoUrls.push(url);
      }
      if (fotoPemilikFile) {
        const url = await uploadToSupabase(fotoPemilikFile);
        photoUrls.push(url);
      }
      if (fotoBebasFile) {
        const url = await uploadToSupabase(fotoBebasFile);
        photoUrls.push(url);
      }

      const payload = {
        name: formData.name,
        owner_name: "Admin Desa",
        category: formData.category,
        address: formData.address,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        photos: photoUrls,
        description: formData.description,
        Maps_url: formData.Maps_url,
      };

      const response = await fetch("http://localhost:3000/umkm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gagal menyimpan UMKM: ${response.status} - ${errorText}`);
      }

      const newUmkmFromBackend = await response.json();
      onSubmit(newUmkmFromBackend);
      onClose();
    } catch (error) {
      console.error("❌ Terjadi kesalahan saat menambah UMKM:", error);
      alert("Tambah UMKM gagal: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center overflow-y-auto">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl mx-4">
        <h2 className="text-xl font-bold mb-4">Tambah UMKM Baru</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* KIRI */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nama UMKM</label>
                <input name="name" value={formData.name} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Kategori</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full border px-3 py-2 rounded" required>
                  <option value="">Pilih Kategori</option>
                  <option value="Kuliner">Kuliner</option>
                  <option value="Kerajinan">Kerajinan</option>
                  <option value="Jasa">Jasa</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Alamat</label>
                <textarea name="address" value={formData.address} onChange={handleChange} className="w-full border px-3 py-2 rounded" rows={2} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Deskripsi</label>
                <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border px-3 py-2 rounded" rows={2} />
              </div>
            </div>

            {/* KANAN */}
            <div className="space-y-4">
              {/* INPUT LATITUDE DAN LONGITUDE DISEM BUNYIKAN! */}
              <input type="hidden" name="latitude" value={formData.latitude} />
              <input type="hidden" name="longitude" value={formData.longitude} />

              {/* Input Foto Produk */}
              <div>
                <label className="block text-sm font-medium mb-1">Foto Produk</label>
                <input type="file" name="fotoProduk" accept="image/*" onChange={handleChange} className="w-full border px-3 py-2 rounded" />
                {previewFotoProduk && <img src={previewFotoProduk} alt="Preview Produk" className="mt-2 h-40 object-cover rounded" />}
              </div>

              {/* Input Foto Pemilik */}
              <div>
                <label className="block text-sm font-medium mb-1">Foto Pemilik</label>
                <input type="file" name="fotoPemilik" accept="image/*" onChange={handleChange} className="w-full border px-3 py-2 rounded" />
                {previewFotoPemilik && <img src={previewFotoPemilik} alt="Preview Pemilik" className="mt-2 h-40 object-cover rounded" />}
              </div>

              {/* Input Foto Bebas */}
              <div>
                <label className="block text-sm font-medium mb-1">Foto Bebas</label>
                <input type="file" name="fotoBebas" accept="image/*" onChange={handleChange} className="w-full border px-3 py-2 rounded" />
                {previewFotoBebas && <img src={previewFotoBebas} alt="Preview Bebas" className="mt-2 h-40 object-cover rounded" />}
              </div>

              {/* Link Google Maps dengan Feedback */}
              <div>
                <label htmlFor="Maps_url" className="block text-sm font-medium mb-1">
                  Link Google Maps
                </label>
                <div className="relative">
                  <input id="Maps_url" name="Maps_url" value={formData.Maps_url} onChange={handleChange} className="w-full px-3 py-2 border rounded" placeholder="Paste URL Google Maps di sini (link pendek atau panjang)" />
                  {latLngStatus === "loading" && <FiLoader className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 text-lg animate-spin" title="Mengekstrak koordinat..." />}
                  {latLngStatus === "success" && <FiCheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-lg" title="Koordinat berhasil diekstrak!" />}
                  {latLngStatus === "error" && <FiAlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 text-lg" title="URL tidak valid atau koordinat tidak ditemukan." />}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <button type="button" onClick={onClose} className="text-sm px-4 py-2 rounded border">
              Batal
            </button>
            <button type="submit" disabled={isLoading} className="text-sm px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? "Menyimpan..." : "Tambah UMKM"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalTambahUMKM;
