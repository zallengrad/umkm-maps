// frontend/src/components/ModalTambahUMKM.jsx
import React, { useState, useEffect } from "react";
import { uploadToSupabase } from "../utils/uploadToSupabase";
import { supabase } from "../utils/supabaseClient"; // Pastikan ini mengimpor instance Supabase

const ModalTambahUMKM = ({ onClose, onSubmit }) => {
  // Tambahkan onSubmit prop
  const [formData, setFormData] = useState({
    nama: "",
    kategori: "",
    alamat: "",
    lat: "",
    lng: "",
    deskripsi: "",
    link_maps: "",
  });

  const [fotoFile, setFotoFile] = useState(null);
  const [previewFoto, setPreviewFoto] = useState("");
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Tambahkan state loading

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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "foto" && files && files.length > 0) {
      const file = files[0];
      const previewURL = URL.createObjectURL(file);
      setPreviewFoto(previewURL);
      setFotoFile(file);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Mulai loading

    try {
      let photoUrl = "";
      if (fotoFile) {
        photoUrl = await uploadToSupabase(fotoFile);
        console.log("📸 Gambar berhasil diunggah! URL:", photoUrl);
      } else {
        console.warn("⚠️ Tidak ada gambar yang dipilih untuk diunggah.");
      }

      const payload = {
        name: formData.nama,
        owner_name: "Admin Desa",
        category: formData.kategori,
        address: formData.alamat,
        latitude: parseFloat(formData.lat),
        longitude: parseFloat(formData.lng),
        photos: photoUrl ? [photoUrl] : [],
        description: formData.deskripsi,
        Maps_url: formData.link_maps,
      };

      console.log("📤 Mengirim data UMKM ke backend:", payload);
      const response = await fetch("http://localhost:3000/umkm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gagal menyimpan UMKM: ${response.status} - ${errorText}`);
      }

      const newUmkmFromBackend = await response.json(); // ✨ TANGKAP RESPONS DARI BACKEND ✨
      console.log("🎉 UMKM berhasil ditambahkan:", newUmkmFromBackend);

      onSubmit(newUmkmFromBackend); // ✨ Panggil onSubmit dengan data UMKM baru ✨
      // onClose(); // onClose akan dipanggil setelah onSubmit selesai
    } catch (error) {
      console.error("❌ Terjadi kesalahan saat menambah UMKM:", error);
      alert("Upload gagal: " + error.message);
    } finally {
      setIsLoading(false); // Selesai loading
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
                <input name="nama" value={formData.nama} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Kategori</label>
                <select name="kategori" value={formData.kategori} onChange={handleChange} className="w-full border px-3 py-2 rounded" required>
                  <option value="">Pilih Kategori</option>
                  <option value="Kuliner">Kuliner</option>
                  <option value="Kerajinan">Kerajinan</option>
                  <option value="Jasa">Jasa</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Alamat</label>
                <textarea name="alamat" value={formData.alamat} onChange={handleChange} className="w-full border px-3 py-2 rounded" rows={2} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Deskripsi</label>
                <textarea name="deskripsi" value={formData.deskripsi} onChange={handleChange} className="w-full border px-3 py-2 rounded" rows={2} />
              </div>
            </div>

            {/* KANAN */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Latitude</label>
                <input name="lat" type="number" step="any" value={formData.lat} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Longitude</label>
                <input name="lng" type="number" step="any" value={formData.lng} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Gambar UMKM</label>
                <input type="file" name="foto" accept="image/*" onChange={handleChange} className="w-full border px-3 py-2 rounded" />
                {previewFoto && <img src={previewFoto} alt="Preview" className="mt-2 h-40 object-cover rounded" />}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Link Google Maps</label>
                <input name="link_maps" value={formData.link_maps} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
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
