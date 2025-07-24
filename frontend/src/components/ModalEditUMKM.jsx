import React, { useEffect, useState } from "react";

const ModalEditUMKM = ({ umkm, onClose, onSave }) => {
  const [formData, setFormData] = useState(umkm);
  const [previewFoto, setPreviewFoto] = useState(umkm.foto);

  useEffect(() => {
    setFormData(umkm);
    setPreviewFoto(umkm.foto);
  }, [umkm]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "foto" && files && files.length > 0) {
      const file = files[0];
      const previewURL = URL.createObjectURL(file);
      setPreviewFoto(previewURL);
      setFormData((prev) => ({ ...prev, foto: previewURL }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
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

          {/* Tombol aksi */}
          <div className="flex justify-end gap-3 pt-6">
            <button type="button" onClick={onClose} className="text-sm px-4 py-2 rounded border">
              Batal
            </button>
            <button type="submit" className="text-sm px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditUMKM;
