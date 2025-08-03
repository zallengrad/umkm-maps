// frontend/src/components/ModalTambahUMKM.jsx
import React, { useState, useEffect, useRef } from "react";
import { uploadToSupabase } from "../utils/uploadToSupabase";
import { supabase } from "../utils/supabaseClient";
// ✨ HAPUS FiCheckCircle, FiAlertCircle, FiLoader dari import ini ✨
import { FiXCircle, FiPlus } from "react-icons/fi";
import { API_BASE_URL } from "../utils/apiConfig";

// DAFTAR KATEGORI UMKM YANG LENGKAP
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

// DAFTAR DUSUN DI DESA BEJIARUM (digunakan juga di AdminPage)
const DUSUN_OPTIONS = [
  "", // Opsi default "Pilih Dusun"
  "Kalicecep",
  "Beji Jurang",
  "Beji Dukuh",
  "Penanggulan",
  "Berngosan",
];

const ModalTambahUMKM = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    rt_rw: "", // Input baru untuk RT/RW
    dusun: "", // Input baru untuk Dusun
    description: "",
    Maps_url: "", // ✨ PERBAIKAN DI SINI: Maps_url ✨
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const fileInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState("");
  // ✨ HAPUS STATE latLngStatus (tidak dipakai lagi) ✨
  // const [latLngStatus, setLatLngStatus] = useState("idle");

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

    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.filter((file) => !selectedFiles.some((f) => f.name === file.name && f.size === file.size && f.type === file.type));

    setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles].slice(0, 3));
    setPreviewUrls((prevUrls) => [...prevUrls, ...newFiles.map((file) => URL.createObjectURL(file))].slice(0, 3));

    if (fileInputRef.current) {
      e.target.value = "";
    }
  };

  const handleRemoveFile = (indexToRemove) => {
    const fileToRemove = selectedFiles.find((_, index) => index === indexToRemove);
    if (fileToRemove) {
      URL.revokeObjectURL(previewUrls.find((_, index) => index === indexToRemove));
    }

    setSelectedFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
    setPreviewUrls((prevUrls) => prevUrls.filter((_, index) => index !== indexToRemove));
  };

  const handleAddMorePhotos = () => {
    if (selectedFiles.length < 3 && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // ✨ UBAH handleChange: Hapus semua logika auto-populate ✨
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Tidak ada lagi logika if (name === "Maps_url") di sini
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    let photoUrls = [];

    try {
      // Validasi lat/lng dihapus karena tidak lagi diisi otomatis/disimpan
      // if (formData.Maps_url && (isNaN(parseFloat(formData.latitude)) || isNaN(parseFloat(formData.longitude)))) {
      //   throw new Error("Koordinat Latitude atau Longitude tidak valid dari URL Google Maps. Pastikan URL Maps benar.");
      // }

      for (const file of selectedFiles) {
        const url = await uploadToSupabase(file);
        photoUrls.push(url);
      }
      while (photoUrls.length < 3) {
        photoUrls.push(null);
      }
      if (photoUrls.length > 3) {
        photoUrls = photoUrls.slice(0, 3);
      }

      // Rangkai string 'address' dari input terstruktur
      let fullAddress = [];
      if (formData.rt_rw.trim()) {
        fullAddress.push(`RT.${formData.rt_rw.trim()}`);
      }
      if (formData.dusun.trim()) {
        fullAddress.push(`Dusun ${formData.dusun.trim()}`);
      }
      fullAddress.push("Bejiarum, Kec. Kertek, Kabupaten Wonosobo, Jawa Tengah 56371");
      const finalAddressString = fullAddress.join(", ");

      const payload = {
        name: formData.name,
        owner_name: "Admin Desa",
        category: formData.category,
        address: finalAddressString,
        description: formData.description,
        Maps_url: formData.Maps_url, // ✨ PERBAIKAN DI SINI: Maps_url ✨
        // Latitude dan longitude dihapus dari payload jika tidak disimpan di DB
        latitude: null,
        longitude: null,
        photos: photoUrls,
      };

      const response = await fetch(`${API_BASE_URL}/umkm`, {
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
                  {UMKM_CATEGORIES.map((kategori) => (
                    <option key={kategori} value={kategori}>
                      {kategori}
                    </option>
                  ))}
                </select>
              </div>

              {/* INPUT BARU: RT/RW dan Dusun */}
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm font-medium mb-1">RT/RW (Opsional)</label>
                  <input name="rt_rw" value={formData.rt_rw} onChange={handleChange} className="w-full border px-3 py-2 rounded" placeholder="Contoh: 01/02" />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium mb-1">Dusun</label>
                  <select name="dusun" value={formData.dusun} onChange={handleChange} className="w-full border px-3 py-2 rounded" required>
                    {DUSUN_OPTIONS.map((dusun) => (
                      <option key={dusun || "default"} value={dusun}>
                        {dusun || "Pilih Dusun"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Deskripsi</label>
                <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border px-3 py-2 rounded" rows={2} />
              </div>

              {/* Tampilkan Desa, Kecamatan, Kabupaten, Provinsi otomatis */}
              <div className="text-sm text-gray-600">Desa: Bejiarum, Kec. Kertek, Kab. Wonosobo, Jawa Tengah</div>
            </div>

            {/* KANAN */}
            <div className="space-y-4">
              {/* INPUT LATITUDE DAN LONGITUDE DISEM BUNYIKAN! (Dihapus dari state dan JSX) */}

              {/* MODIFIED PHOTO UPLOAD SECTION */}
              <div>
                <label className="block text-sm font-medium mb-1">Foto UMKM (hingga 3 foto)</label>
                <input type="file" ref={fileInputRef} accept="image/*" multiple onChange={handleFileChange} className="hidden" />
                <div className="flex flex-row gap-2">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative h-24 w-24">
                      <img src={url} alt={`Preview ${index}`} className="h-full w-full object-cover rounded" />
                      <button type="button" onClick={() => handleRemoveFile(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs" title="Hapus foto">
                        <FiXCircle />
                      </button>
                    </div>
                  ))}
                  {selectedFiles.length < 3 && (
                    <button
                      type="button"
                      onClick={handleAddMorePhotos}
                      className="h-24 w-24 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-500 transition"
                    >
                      <FiPlus size={24} />
                    </button>
                  )}
                </div>
                {selectedFiles.length > 3 && <p className="text-red-500 text-xs mt-1">Hanya 3 foto pertama yang akan disimpan.</p>}
              </div>

              {/* Link Google Maps (tanpa Feedback auto-populate) */}
              <div>
                <label htmlFor="Maps_url" className="block text-sm font-medium mb-1">
                  Link Google Maps
                </label>
                <div className="relative">
                  <input
                    id="Maps_url"
                    name="Maps_url"
                    value={formData.Maps_url}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded" // Tidak perlu pr-8 lagi
                    placeholder="Paste URL Google Maps di sini"
                  />
                  {/* Ikon validasi dihapus */}
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
