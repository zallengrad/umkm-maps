// backend/models/umkmModel.js
const supabase = require("../utils/supabaseClient");

// Get all UMKMs (tidak berubah)
const getAllUMKMs = async () => {
  const { data, error } = await supabase.from("umkms").select("*").order("id", { ascending: true });
  if (error) throw error;
  return data;
};

// ✨ TAMBAHKAN FUNGSI INI! ✨
const getUMKMById = async (id) => {
  // Select semua kolom dari tabel 'umkms' di mana ID cocok
  const { data, error } = await supabase.from("umkms").select("*").eq("id", id).single(); // .single() untuk mendapatkan satu record saja

  if (error) {
    console.error("Error fetching UMKM by ID in model:", error);
    throw error; // Lempar error agar ditangani di controller
  }
  return data; // Akan mengembalikan null jika tidak ditemukan, atau objek UMKM
};

// Create new UMKM (tidak berubah)
const createUMKM = async (newData) => {
  const { data, error } = await supabase.from("umkms").insert([newData]).select();
  if (error) throw error;
  return data[0];
};

// Update UMKM by id (tidak berubah)
const updateUMKM = async (id, updatedData) => {
  const { data, error } = await supabase.from("umkms").update(updatedData).eq("id", id).select();
  if (error) throw error;
  return data[0];
};

// Delete UMKM by id (tidak berubah)
const deleteUMKM = async (id) => {
  const { data, error } = await supabase.from("umkms").delete().eq("id", id).select();
  if (error) throw error;
  return data[0];
};

module.exports = {
  getAllUMKMs,
  getUMKMById,
  createUMKM,
  updateUMKM,
  deleteUMKM,
};
