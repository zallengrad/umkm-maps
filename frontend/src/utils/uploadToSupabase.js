// frontend/src/utils/uploadToSupabase.js

// Pastikan ini mengarah ke file di mana Anda menginisialisasi Supabase client
// Contoh: src/utils/supabaseClient.js
import { supabase } from "./supabaseClient"; // Sesuaikan path jika berbeda!

const UPLOAD_BUCKET = "umkm-photos"; // 🚨🚨 PASTIKAN NAMA BUCKET INI SAMA PERSIS DI SUPABASE STORAGE-MU! 🚨🚨

// Fungsi ini sekarang HANYA menerima 'file'
export const uploadToSupabase = async (file) => {
  if (!file || !file.name) {
    console.error("❌ uploadToSupabase: File tidak valid atau tidak memiliki nama.");
    throw new Error("File tidak valid atau tidak memiliki nama");
  }

  // Nama file sekarang di dalam sub-folder 'umkm/' tanpa userId
  const filename = `umkm/${Date.now()}-${file.name.replace(/\s/g, "_")}`; // Ganti spasi dengan underscore

  console.log(`✅ Memulai upload (versi sederhana):`);
  console.log(`   - Bucket: ${UPLOAD_BUCKET}`);
  console.log(`   - Filename di Storage: ${filename}`);
  console.log(`   - Tipe File: ${file.type}`);
  console.log(`   - Ukuran File: ${file.size} bytes`);

  try {
    const { error } = await supabase.storage.from(UPLOAD_BUCKET).upload(filename, file, {
      contentType: file.type, // tipe file penting
      upsert: false, // jangan menimpa jika sudah ada
    });

    if (error) {
      console.error("❌ Supabase Storage Upload GAGAL! Detail Error:", error);
      throw new Error(`Gagal mengunggah gambar ke Supabase Storage: ${error.message || "Unknown error"}`);
    }

    console.log("✅ Unggah Berhasil!");

    const { data } = supabase.storage.from(UPLOAD_BUCKET).getPublicUrl(filename);

    if (!data || !data.publicUrl) {
      console.error("❌ Gagal mendapatkan URL publik setelah unggahan berhasil.");
      throw new Error("Tidak dapat mendapatkan URL publik setelah unggahan berhasil.");
    }

    console.log("🔗 URL Publik Gambar Ditemukan:", data.publicUrl);
    return data.publicUrl;
  } catch (error) {
    console.error("🔥 Error Menyeluruh di fungsi uploadToSupabase:", error);
    throw error;
  }
};
