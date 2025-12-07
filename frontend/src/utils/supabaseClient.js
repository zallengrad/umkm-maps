// frontend/src/utils/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("🚨🚨 ERROR: Pastikan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY ada di file .env.local frontend Anda!");
}

// ✨ FUNGSI INI AKAN MENENTUKAN TEMPAT PENYIMPANAN SUPABASE AUTH ✨
const getAuthStorage = () => {
  // Jika 'isLoggedIn' di localStorage (setelah login Remember Me) ada dan true, gunakan localStorage.
  // Jika tidak, gunakan sessionStorage.
  // Ini mengontrol di mana Supabase menyimpan refresh token-nya.
  const rememberMeFlag = localStorage.getItem("isLoggedIn");
  if (rememberMeFlag === "true") {
    return localStorage;
  }
  return sessionStorage;
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: getAuthStorage(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
