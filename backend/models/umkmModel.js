// models/umkmModel.js
const supabase = require("../utils/supabaseClient");

// Get all UMKMs
const getAllUMKMs = async () => {
  const { data, error } = await supabase.from("umkms").select("*").order("id", { ascending: true });

  if (error) throw error;
  return data;
};

// Create new UMKM
const createUMKM = async (newData) => {
  const { data, error } = await supabase.from("umkms").insert([newData]).select(); // supaya langsung balikin data baru

  if (error) throw error;
  return data[0];
};

// Update UMKM by id
const updateUMKM = async (id, updatedData) => {
  const { data, error } = await supabase.from("umkms").update(updatedData).eq("id", id).select();

  if (error) throw error;
  return data[0];
};

// Delete UMKM by id
const deleteUMKM = async (id) => {
  const { data, error } = await supabase.from("umkms").delete().eq("id", id).select();

  if (error) throw error;
  return data[0];
};

module.exports = {
  getAllUMKMs,
  createUMKM,
  updateUMKM,
  deleteUMKM,
};
