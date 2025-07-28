// frontend/src/components/ModalEditUMKM.jsx
import React, { useEffect, useState, useRef } from "react"; // Tambahkan useRef
import { uploadToSupabase } from "../utils/uploadToSupabase";
import { FiCheckCircle, FiAlertCircle, FiLoader, FiXCircle, FiPlus } from "react-icons/fi"; // Tambahkan FiPlus

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

const ModalEditUMKM = ({ umkm, onClose, onSave }) => {
  // ✨ LOG UNTUK MELIHAT DATA UMKM SAAT MODAL DIBUKA ✨
  console.log("ModalEditUMKM: Menerima UMKM:", umkm);

  const [formData, setFormData] = useState({
    name: umkm.name || "",
    category: umkm.category || "",
    address: umkm.address || "",
    latitude: umkm.latitude || "",
    longitude: umkm.longitude || "",
    description: umkm.description || "",
    Maps_url: umkm.Maps_url || "",
  });

  // ✨ STATE BARU UNTUK MENGELOLA FOTO (Gabungan existing dan new) ✨
  const [photosToUpload, setPhotosToUpload] = useState([]); // Array of { file: File|null, url: string }
  const fileInputRef = useRef(null); // Ref to the hidden file input

  const [isLoading, setIsLoading] = useState(false);
  const [latLngStatus, setLatLngStatus] = useState("idle");

  // Effect untuk mengupdate formData dan photosToUpload saat prop umkm berubah
  useEffect(() => {
    console.log("ModalEditUMKM: useEffect dipicu, umkm:", umkm);

    setFormData({
      name: umkm.name || "",
      category: umkm.category || "",
      address: umkm.address || "",
      latitude: umkm.latitude || "",
      longitude: umkm.longitude || "",
      description: umkm.description || "",
      Maps_url: umkm.Maps_url || "",
    });

    // Inisialisasi photosToUpload dengan foto yang sudah ada
    const initialPhotos = (umkm.photos || [])
      .map((url) => ({ file: null, url: url || null })) // Mark existing photos as {file: null, url: 'existing_url'}
      .filter((photo) => photo.url !== null); // Filter out nulls if any

    // Isi sampai 3 slot, jika kurang, tambahkan slot null
    while (initialPhotos.length < 3) {
      initialPhotos.push({ file: null, url: null });
    }
    setPhotosToUpload(initialPhotos.slice(0, 3)); // Pastikan hanya 3 slot

    setLatLngStatus("idle");
  }, [umkm]);

  // ✨ FUNGSI UNTUK MENANGANI PILIHAN BANYAK FILE FOTO (Tambah Baru/Ganti Existing) ✨
  const handleFileChange = (e, indexToReplace = null) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newFile = files[0];
    const newPreviewUrl = URL.createObjectURL(newFile);

    setPhotosToUpload((prevPhotos) => {
      const updatedPhotos = [...prevPhotos];

      if (indexToReplace !== null && updatedPhotos[indexToReplace]) {
        // Ganti foto yang ada di slot tertentu
        if (updatedPhotos[indexToReplace].url) {
          URL.revokeObjectURL(updatedPhotos[indexToReplace].url); // Hapus URL lama dari memori
        }
        updatedPhotos[indexToReplace] = { file: newFile, url: newPreviewUrl };
      } else {
        // Tambahkan ke slot kosong pertama atau di akhir
        const firstEmptyIndex = updatedPhotos.findIndex((p) => p.url === null);
        if (firstEmptyIndex !== -1 && firstEmptyIndex < 3) {
          if (updatedPhotos[firstEmptyIndex].url) {
            URL.revokeObjectURL(updatedPhotos[firstEmptyIndex].url);
          }
          updatedPhotos[firstEmptyIndex] = { file: newFile, url: newPreviewUrl };
        } else if (updatedPhotos.length < 3) {
          updatedPhotos.push({ file: newFile, url: newPreviewUrl });
        } else {
          // Jika sudah 3 dan tidak ada slot kosong, ganti slot pertama (atau berikan pesan error)
          // Contoh: updatedPhotos[0] = { file: newFile, url: newPreviewUrl };
          alert("Anda hanya bisa menambahkan hingga 3 foto. Untuk menambah foto baru, hapus salah satu foto yang sudah ada.");
          return prevPhotos; // Jangan ubah state
        }
      }
      return updatedPhotos.slice(0, 3); // Pastikan tidak lebih dari 3
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset input agar file yang sama bisa dipilih lagi
    }
  };

  // ✨ FUNGSI BARU UNTUK MENGHAPUS FOTO DARI DAFTAR PRATINJAU ✨
  const handleRemoveFile = (indexToRemove) => {
    setPhotosToUpload((prevPhotos) => {
      const updatedPhotos = [...prevPhotos];
      if (updatedPhotos[indexToRemove] && updatedPhotos[indexToRemove].url) {
        URL.revokeObjectURL(updatedPhotos[indexToRemove].url); // Hapus URL preview dari memori
      }
      // Set slot menjadi null, jangan dihapus dari array untuk menjaga panjang 3
      updatedPhotos[indexToRemove] = { file: null, url: null };
      return updatedPhotos;
    });
  };

  const handleAddMorePhotos = (index) => {
    if (fileInputRef.current) {
      fileInputRef.current.dataset.indexToReplace = index; // Simpan index slot yang akan diganti
      fileInputRef.current.click();
    }
  };

  const handleChange = async (e) => {
    const { name, value, files: inputFiles } = e.target; // Rename 'files' to 'inputFiles'

    // Handle non-file inputs
    if (name !== "fotoProduk" && name !== "fotoPemilik" && name !== "fotoBebas") {
      // Ini tidak lagi relevan
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
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    let finalPhotoUrls = []; // Array final dari URL gambar yang akan dikirim ke backend

    try {
      // Validasi tambahan: Pastikan lat & lng terisi jika URL Maps diisi
      if (formData.Maps_url && (isNaN(parseFloat(formData.latitude)) || isNaN(parseFloat(formData.longitude)))) {
        throw new Error("Koordinat Latitude atau Longitude tidak valid dari URL Google Maps. Pastikan URL Maps benar.");
      }

      // ✨ LOOP UNTUK MENGUPLOAD FILE BARU DAN MENGUMPULKAN URL ✨
      for (const photo of photosToUpload) {
        if (photo.file) {
          // Jika ada file baru di slot ini
          console.log(`🚀 Mengunggah file baru: ${photo.file.name}...`);
          const url = await uploadToSupabase(photo.file);
          finalPhotoUrls.push(url);
        } else if (photo.url) {
          // Jika ini adalah foto lama yang tidak diganti
          finalPhotoUrls.push(photo.url);
        } else {
          // Jika slot kosong (null)
          finalPhotoUrls.push(null);
        }
      }

      // Pastikan array photos memiliki 3 slot (bisa null) untuk konsistensi DB
      while (finalPhotoUrls.length < 3) {
        finalPhotoUrls.push(null);
      }
      finalPhotoUrls = finalPhotoUrls.slice(0, 3); // Pastikan tidak lebih dari 3

      const payload = {
        name: formData.name,
        category: formData.category,
        address: formData.address,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        photos: finalPhotoUrls, // Gunakan array URL gambar final
        description: formData.description,
        Maps_url: formData.Maps_url,
      };

      console.log("📤 Mengirim data UMKM terupdate ke backend:", payload);

      const response = await fetch(`http://localhost:3000/umkm/${umkm.id}`, {
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

              {/* ✨ MODIFIED PHOTO UPLOAD SECTION (Sama seperti ModalTambah) ✨ */}
              <div>
                <label className="block text-sm font-medium mb-1">Foto UMKM (hingga 3 foto)</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  multiple // Memungkinkan pemilihan banyak file
                  onChange={(e) => {
                    // Perlu handler custom karena pakai ref
                    const index = parseInt(fileInputRef.current.dataset.indexToReplace);
                    handleFileChange(e, isNaN(index) ? null : index);
                  }}
                  className="hidden" // Hide the default file input
                />
                <div className="flex flex-row gap-2">
                  {photosToUpload.map((photo, index) => (
                    <div key={index} className="relative h-24 w-24">
                      {photo.url ? (
                        <img src={photo.url} alt={`Preview ${index}`} className="h-full w-full object-cover rounded" />
                      ) : (
                        // Placeholder for empty slots
                        <div className="h-full w-full border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center bg-gray-50 text-gray-400">
                          <FiPlus size={24} />
                        </div>
                      )}
                      <button type="button" onClick={() => handleRemoveFile(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs" title="Hapus foto">
                        <FiXCircle />
                      </button>
                    </div>
                  ))}
                  {/* Tombol tambah foto jika belum 3 */}
                  {photosToUpload.length < 3 && photosToUpload.filter((p) => p.url !== null).length < 3 && (
                    <button
                      type="button"
                      onClick={() => handleAddMorePhotos(null)} // Panggil dengan null untuk tambah baru
                      className="h-24 w-24 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-500 transition"
                    >
                      <FiPlus size={24} />
                    </button>
                  )}
                </div>
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
