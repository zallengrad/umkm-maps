// frontend/src/components/ModalTambahUMKM.jsx
import React, { useState, useEffect, useRef } from "react";
import { uploadToSupabase } from "../utils/uploadToSupabase";
import { supabase } from "../utils/supabaseClient";
import { FiCheckCircle, FiAlertCircle, FiLoader, FiXCircle, FiPlus } from "react-icons/fi"; // Import FiPlus

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

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const fileInputRef = useRef(null); // Ref to the hidden file input

  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [latLngStatus, setLatLngStatus] = useState("idle");

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

    // Cleanup preview URLs on unmount
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.filter((file) => !selectedFiles.some((f) => f.name === file.name && f.size === file.size && f.type === file.type));

    setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles].slice(0, 3));
    setPreviewUrls((prevUrls) => [...prevUrls, ...newFiles.map((file) => URL.createObjectURL(file))].slice(0, 3));

    // Reset the file input value so the same file can be added again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "Maps_url") {
      if (value.trim() === "") {
        setFormData((prev) => ({ ...prev, latitude: "", longitude: "" }));
        setLatLngStatus("idle");
        return;
      }

      setLatLngStatus("loading");
      try {
        const response = await fetch(`http://localhost:3000/api/maps/resolve?url=${encodeURIComponent(value)}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.lat && data.lng) {
          setFormData((prev) => ({ ...prev, latitude: data.lat.toString(), longitude: data.lng.toString() }));
          setLatLngStatus("success");
          setFormData((prev) => ({ ...prev, Maps_url: data.longUrl || value }));
        } else {
          throw new Error("Koordinat tidak ditemukan di URL ini.");
        }
      } catch (error) {
        console.error("Gagal mengekstrak koordinat:", error);
        setFormData((prev) => ({ ...prev, latitude: "", longitude: "" }));
        setLatLngStatus("error");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    let photoUrls = [];

    try {
      if (formData.Maps_url && (isNaN(parseFloat(formData.latitude)) || isNaN(parseFloat(formData.longitude)))) {
        throw new Error("Koordinat Latitude atau Longitude tidak valid dari URL Google Maps. Pastikan URL Maps benar.");
      }

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
                  {UMKM_CATEGORIES.map((kategori) => (
                    <option key={kategori} value={kategori}>
                      {kategori}
                    </option>
                  ))}
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

              {/* ✨ MODIFIED PHOTO UPLOAD SECTION */}
              <div>
                <label className="block text-sm font-medium mb-1">Foto UMKM (hingga 3 foto)</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden" // Hide the default file input
                />
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
