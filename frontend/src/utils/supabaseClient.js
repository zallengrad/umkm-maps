// frontend/src/utils/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ✨ TAMBAHKAN INI UNTUK DEBUGGING! ✨
console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Anon Key:", supabaseAnonKey ? "Ada (tidak ditampilkan)" : "Tidak ada!"); // Hindari menampilkan key utuh

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("🚨🚨 ERROR: Supabase URL atau Anon Key belum diatur di variabel lingkungan (misal: .env.local)!");
  alert("Konfigurasi Supabase belum lengkap! Cek console browser Anda.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
