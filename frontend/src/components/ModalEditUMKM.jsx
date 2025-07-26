// frontend/src/components/ModalEditUMKM.jsx
import React, { useEffect, useState } from "react";
import { uploadToSupabase } from "../utils/uploadToSupabase"; // Impor fungsi upload
// Pastikan supabase client diimpor jika diperlukan untuk auth atau lainnya,
// tapi untuk upload hanya perlu uploadToSupabase
// import { supabase } from "../utils/supabaseClient";

const ModalEditUMKM = ({ umkm, onClose, onSave }) => {
  // Inisialisasi state dengan data UMKM yang diterima
  const [formData, setFormData] = useState({
    name: umkm.name || "", // Nama
    category: umkm.category || "", // Kategori
    address: umkm.address || "", // Alamat
    latitude: umkm.latitude || "", // Latitude
    longitude: umkm.longitude || "", // Longitude
    description: umkm.description || "", // Deskripsi
    Maps_url: umkm.Maps_url || "", // Link Google Maps
    // photos akan ditangani secara terpisah sebagai array URL
    photos: umkm.photos || [], // Ini adalah array URL gambar yang sudah ada
  });

  const [newFotoFile, setNewFotoFile] = useState(null); // Untuk menyimpan file gambar baru yang dipilih
  // Preview foto: ambil dari array photos yang ada, atau null jika tidak ada
  const [previewFoto, setPreviewFoto] = useState(umkm.photos && umkm.photos.length > 0 ? umkm.photos[0] : "");
  const [isLoading, setIsLoading] = useState(false); // State untuk loading

  // Effect untuk mengupdate formData dan previewFoto jika prop umkm berubah
  useEffect(() => {
    setFormData({
      name: umkm.name || "",
      category: umkm.category || "",
      address: umkm.address || "",
      latitude: umkm.latitude || "",
      longitude: umkm.longitude || "",
      description: umkm.description || "",
      Maps_url: umkm.Maps_url || "",
      photos: umkm.photos || [],
    });
    setNewFotoFile(null); // Reset file baru saat umkm berubah
    setPreviewFoto(umkm.photos && umkm.photos.length > 0 ? umkm.photos[0] : "");
  }, [umkm]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "foto" && files && files.length > 0) {
      const file = files[0];
      setNewFotoFile(file); // Simpan file yang baru dipilih
      setPreviewFoto(URL.createObjectURL(file)); // Buat URL untuk preview
      // Jangan langsung update formData.photos di sini, biarkan di handleSubmit
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    let finalPhotoUrls = formData.photos; // Mulai dengan URL foto yang sudah ada

    try {
      // Jika ada file foto baru yang dipilih, upload dulu
      if (newFotoFile) {
        console.log("🚀 Memulai proses upload gambar baru untuk edit...");
        const newUrl = await uploadToSupabase(newFotoFile);
        console.log("✨ Gambar baru berhasil diunggah! URL:", newUrl);
        finalPhotoUrls = [newUrl]; // Ganti array photos dengan URL baru
      } else {
        console.log("Tidak ada gambar baru dipilih, menggunakan gambar lama.");
      }

      // Buat payload untuk dikirim ke backend
      const payload = {
        name: formData.name,
        // owner_name tidak perlu dikirim jika backend sudah mengaturnya
        category: formData.category,
        address: formData.address,
        latitude: parseFloat(formData.latitude), // Pastikan ini float
        longitude: parseFloat(formData.longitude), // Pastikan ini float
        photos: finalPhotoUrls, // Gunakan array URL gambar final
        description: formData.description,
        Maps_url: formData.Maps_url, // Pastikan ini match dengan nama kolom di DB
      };

      console.log("📤 Mengirim data UMKM terupdate ke backend:", payload);

      // Panggil API PUT ke backend untuk update data
      const response = await fetch(`http://localhost:3000/umkm/${umkm.id}`, {
        // Gunakan umkm.id dari prop
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gagal menyimpan perubahan UMKM: ${response.status} - ${errorText}`);
      }

      const updatedUmkmFromBackend = await response.json();
      console.log("🎉 UMKM berhasil diperbarui:", updatedUmkmFromBackend);

      onSave(updatedUmkmFromBackend); // Panggil onSave dengan data UMKM yang diperbarui dari backend
      onClose(); // Tutup modal
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
                <input name="name" value={formData.name} onChange={handleChange} className="w-full border px-3 py-2 rounded" required /> {/* name field */}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Kategori</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full border px-3 py-2 rounded" required>
                  {" "}
                  {/* category field */}
                  <option value="">Pilih Kategori</option>
                  <option value="Kuliner">Kuliner</option>
                  <option value="Kerajinan">Kerajinan</option>
                  <option value="Jasa">Jasa</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Alamat</label>
                <textarea name="address" value={formData.address} onChange={handleChange} className="w-full border px-3 py-2 rounded" rows={2} /> {/* address field */}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Deskripsi</label>
                <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border px-3 py-2 rounded" rows={2} /> {/* description field */}
              </div>
            </div>

            {/* KANAN */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Latitude</label>
                <input name="latitude" type="number" step="any" value={formData.latitude} onChange={handleChange} className="w-full border px-3 py-2 rounded" /> {/* latitude field */}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Longitude</label>
                <input name="longitude" type="number" step="any" value={formData.longitude} onChange={handleChange} className="w-full border px-3 py-2 rounded" /> {/* longitude field */}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Gambar UMKM</label>
                <input type="file" name="foto" accept="image/*" onChange={handleChange} className="w-full border px-3 py-2 rounded" />
                {previewFoto && <img src={previewFoto} alt="Preview" className="mt-2 h-40 object-cover rounded" />}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Link Google Maps</label>
                <input name="Maps_url" value={formData.Maps_url} onChange={handleChange} className="w-full border px-3 py-2 rounded" /> {/* Maps_url field */}
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
