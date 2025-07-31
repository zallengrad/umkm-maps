// frontend/src/utils/apiConfig.js

// Ambil BASE_URL dari variabel lingkungan
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Jika variabel tidak ditemukan (misal di lingkungan testing/build), berikan fallback
if (!API_BASE_URL) {
  console.error("🚨 ERROR: VITE_API_BASE_URL tidak ditemukan di .env frontend Anda!");
  // Anda bisa memberikan nilai default atau melempar error
  // throw new Error("API base URL is not configured.");
}

export { API_BASE_URL };
