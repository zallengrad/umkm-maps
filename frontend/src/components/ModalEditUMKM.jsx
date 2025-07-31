// frontend/src/components/ModalEditUMKM.jsx
import React, { useEffect, useState, useRef } from "react";
import { uploadToSupabase } from "../utils/uploadToSupabase";
import { FiXCircle, FiPlus } from "react-icons/fi";
import { API_BASE_URL } from "../utils/apiConfig";

// DAFTAR KATEGORI UMKM YANG LENGKAP (Sama dengan AdminPage/HomePage)
const UMKM_CATEGORIES = ["Kuliner", "Jasa", "Kerajinan / Handmade", "Perdagangan (Retail/Reseller)", "Digital / Kreatif", "Pertanian", "Perikanan & Peternakan", "Kosmetik & Herbal", "Mainan & Edukasi Anak", "Manufaktur Rumahan", "Lainnya"];

// DAFTAR DUSUN DI DESA BEJIARUM (Sama dengan ModalTambahUMKM)
const DUSUN_OPTIONS = [
  "", // Opsi default "Pilih Dusun"
  "Kalicecep",
  "Beji Jurang",
  "Beji Dukuh",
  "Penanggulan",
  "Berngosan",
];

const ModalEditUMKM = ({ umkm, onClose, onSave }) => {
  console.log("ModalEditUMKM: Menerima UMKM:", umkm);

  const [formData, setFormData] = useState({
    name: umkm.name || "",
    category: umkm.category || "",
    // ✨ UBAH INI: rt_rw dan dusun ✨
    rt_rw: "",
    dusun: "",
    description: umkm.description || "",
    Maps_url: umkm.Maps_url || "", // ✨ PERBAIKAN: Maps_url ✨
  });

  const [photosToUpload, setPhotosToUpload] = useState([]);
  const fileInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  // latLngStatus dihapus

  useEffect(() => {
    console.log("ModalEditUMKM: useEffect dipicu, umkm:", umkm);

    // ✨ LOGIKA BARU: Ekstrak RT/RW dan Dusun dari string address yang sudah ada ✨
    let extractedRtRw = "";
    let extractedDusun = "";

    if (umkm.address) {
      const addressLower = umkm.address.toLowerCase();

      // Coba ekstrak RT/RW (format "RT.XX/YY" atau "RT XX/YY")
      const rtRwMatch = addressLower.match(/rt\.?\s*(\d+)\/?r?w?\.?\s*(\d+)?/);
      if (rtRwMatch && rtRwMatch[1]) {
        extractedRtRw = `0${parseInt(rtRwMatch[1])}`.slice(-2); // Pastikan 2 digit
        if (rtRwMatch[2]) {
          extractedRtRw += `/${`0${parseInt(rtRwMatch[2])}`.slice(-2)}`;
        }
      }

      // Coba ekstrak Dusun
      for (const d of DUSUN_OPTIONS) {
        if (d && addressLower.includes(d.toLowerCase())) {
          extractedDusun = d;
          break;
        }
      }
    }

    setFormData({
      name: umkm.name || "",
      category: umkm.category || "",
      rt_rw: extractedRtRw, // ✨ Gunakan hasil ekstraksi ✨
      dusun: extractedDusun, // ✨ Gunakan hasil ekstraksi ✨
      description: umkm.description || "",
      Maps_url: umkm.Maps_url || "", // ✨ PERBAIKAN: Maps_url ✨
    });

    const initialPhotos = (umkm.photos || []).map((url) => ({ file: null, url: url || null })).filter((photo) => photo.url !== null);

    while (initialPhotos.length < 3) {
      initialPhotos.push({ file: null, url: null });
    }
    setPhotosToUpload(initialPhotos.slice(0, 3));

    // latLngStatus dihapus
  }, [umkm]);

  const handleFileChange = (e, indexToReplace = null) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newFile = files[0];
    const newPreviewUrl = URL.createObjectURL(newFile);

    setPhotosToUpload((prevPhotos) => {
      const updatedPhotos = [...prevPhotos];

      let targetIndex = indexToReplace;
      if (targetIndex === null) {
        targetIndex = updatedPhotos.findIndex((p) => p.url === null);
        if (targetIndex === -1 && updatedPhotos.length < 3) {
          targetIndex = updatedPhotos.length;
        } else if (targetIndex === -1 && updatedPhotos.length === 3) {
          alert("Anda hanya bisa memiliki hingga 3 foto. Untuk menambah foto baru, hapus salah satu slot foto yang sudah ada.");
          return prevPhotos;
        }
      }

      if (targetIndex !== null && targetIndex >= 0 && targetIndex < 3) {
        if (updatedPhotos[targetIndex] && updatedPhotos[targetIndex].url) {
          URL.revokeObjectURL(updatedPhotos[targetIndex].url);
        }
        updatedPhotos[targetIndex] = { file: newFile, url: newPreviewUrl };
      } else if (updatedPhotos.length < 3) {
        updatedPhotos.push({ file: newFile, url: newPreviewUrl });
      } else {
        alert("Anda hanya bisa memiliki hingga 3 foto. Untuk menambah foto baru, hapus salah satu slot foto yang sudah ada.");
        return prevPhotos;
      }

      const finalPhotos = updatedPhotos.filter((p) => p.url !== null || p.file !== null).slice(0, 3);
      while (finalPhotos.length < 3) {
        finalPhotos.push({ file: null, url: null });
      }
      return finalPhotos;
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.removeAttribute("data-index-to-replace");
    }
  };

  const handleRemoveFile = (indexToRemove) => {
    setPhotosToUpload((prevPhotos) => {
      const updatedPhotos = [...prevPhotos];
      if (updatedPhotos[indexToRemove] && updatedPhotos[indexToRemove].url) {
        URL.revokeObjectURL(updatedPhotos[indexToRemove].url);
      }
      updatedPhotos[indexToRemove] = { file: null, url: null };

      const sortedPhotos = updatedPhotos.filter((p) => p.url !== null || p.file !== null);
      while (sortedPhotos.length < 3) {
        sortedPhotos.push({ file: null, url: null });
      }

      return sortedPhotos;
    });
  };

  const handleAddOrReplacePhotos = (index) => {
    if (fileInputRef.current) {
      fileInputRef.current.dataset.indexToReplace = index;
      fileInputRef.current.click();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    let finalPhotoUrls = [];

    try {
      for (const photo of photosToUpload) {
        if (photo.file) {
          console.log(`🚀 Mengunggah file baru: ${photo.file.name}...`);
          const url = await uploadToSupabase(photo.file);
          finalPhotoUrls.push(url);
        } else if (photo.url) {
          finalPhotoUrls.push(photo.url);
        } else {
          finalPhotoUrls.push(null);
        }
      }

      while (finalPhotoUrls.length < 3) {
        finalPhotoUrls.push(null);
      }
      finalPhotoUrls = finalPhotoUrls.slice(0, 3);

      // ✨ LOGIKA BARU: Rangkai string 'address' dari input terstruktur ✨
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
        category: formData.category,
        address: finalAddressString, // ✨ GUNAKAN STRING ALAMAT YANG DIRANGKAI ✨
        photos: finalPhotoUrls,
        description: formData.description,
        Maps_url: formData.Maps_url, // Tetap kirim linknya
      };

      const response = await fetch(`${API_BASE_URL}/umkm/${umkm.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gagal menyimpan perubahan UMKM: ${response.status} - ${errorText}`);
      }

      const updatedUmkmFromBackend = await response.json();
      onSave(updatedUmkmFromBackend);
      onClose();
    } catch (error) {
      console.error("❌ Terjadi kesalahan saat mengedit UMKM:", error);
      alert("Gagal mengedit UMKM: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center overflow-y-auto">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl mx-4">
        <h2 className="text-xl font-bold mb-4">Edit UMKM</h2>
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

              {/* ✨ INPUT BARU: RT/RW dan Dusun ✨ */}
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

              {/* ✨ Tampilkan Desa, Kecamatan, Kabupaten, Provinsi otomatis ✨ */}
              <div className="text-sm text-gray-600">Desa: Bejiarum, Kec. Kertek, Kab. Wonosobo, Jawa Tengah</div>
            </div>

            {/* KANAN */}
            <div className="space-y-4">
              {/* MODIFIED PHOTO UPLOAD SECTION */}
              <div>
                <label className="block text-sm font-medium mb-1">Foto UMKM (hingga 3 foto)</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  multiple // Memungkinkan pemilihan banyak file
                  onChange={(e) => {
                    const index = parseInt(fileInputRef.current.dataset.indexToReplace);
                    handleFileChange(e, isNaN(index) ? null : index);
                  }}
                  className="hidden" // Sembunyikan input default
                />
                <div className="flex flex-row gap-2">
                  {photosToUpload.map((photo, index) => (
                    <div key={index} className="relative h-24 w-24">
                      {photo.url ? (
                        <img
                          src={photo.url}
                          alt={`Preview ${index}`}
                          className="h-full w-full object-cover rounded cursor-pointer"
                          onClick={() => handleAddOrReplacePhotos(index)} // Klik gambar untuk mengganti
                        />
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleAddOrReplacePhotos(index)} // Klik placeholder untuk menambah
                          className="h-full w-full border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center bg-gray-50 text-gray-400 hover:border-gray-400 hover:text-gray-500 transition"
                        >
                          <FiPlus size={24} />
                        </button>
                      )}
                      <button type="button" onClick={() => handleRemoveFile(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs" title="Hapus foto">
                        <FiXCircle />
                      </button>
                    </div>
                  ))}
                  {photosToUpload.filter((p) => p.url !== null).length < 3 && photosToUpload.length < 3 && (
                    <button
                      type="button"
                      onClick={() => handleAddOrReplacePhotos(null)} // Panggil dengan null untuk tambah baru di slot kosong
                      className="h-24 w-24 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-500 transition"
                    >
                      <FiPlus size={24} />
                    </button>
                  )}
                </div>
              </div>

              {/* Link Google Maps */}
              <div>
                <label htmlFor="Maps_url" className="block text-sm font-medium mb-1">
                  Link Google Maps
                </label>
                <div className="relative">
                  <input id="Maps_url" name="Maps_url" value={formData.Maps_url} onChange={handleChange} className="w-full px-3 py-2 border rounded" placeholder="Paste URL Google Maps di sini" />
                </div>
              </div>
            </div>
          </div>

          {/* Tombol aksi */}
          <div className="flex justify-end gap-3 pt-6">
            <button type="button" onClick={onClose} className="text-sm px-4 py-2 rounded border">
              Batal
            </button>
            <button type="submit" disabled={isLoading} className="text-sm px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditUMKM;
