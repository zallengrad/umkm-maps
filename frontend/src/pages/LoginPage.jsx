// frontend/src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const LoginPage = () => {
  const [username, setUsername] = useState(""); // ✨ UBAH email JADI username ✨
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false); // ✨ STATE BARU untuk remember me ✨
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // ✨ Ganti email dengan username ✨
    if (username === "bejiarumbersatu" && password === "umkm123") {
      // ✨ LOGIKA REMEMBER ME ✨
      if (rememberMe) {
        localStorage.setItem("isLoggedIn", "true"); // Simpan di localStorage untuk persisten
        sessionStorage.removeItem("isLoggedIn"); // Hapus dari sessionStorage jika ada
      } else {
        sessionStorage.setItem("isLoggedIn", "true"); // Simpan di sessionStorage untuk sesi saja
        localStorage.removeItem("isLoggedIn"); // Hapus dari localStorage jika ada
      }
      navigate("/admin");
    } else {
      alert("Username atau password salah.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-yellow-200 to-yellow-50 px-4 pt-16" style={{ fontFamily: "Inter, sans-serif" }}>
        <div className="bg-white/60 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-md text-center border border-yellow-100" data-aos="fade-up" data-aos-delay="200">
          {/* ICON */}
          <div className="mx-auto w-12 h-12 rounded-full bg-white shadow flex items-center justify-center mb-4">
            <span className="text-xl">↪️</span>
          </div>

          {/* TITLE */}
          <h2 className="text-xl font-semibold mb-1 text-yellow-700" style={{ fontFamily: "Poppins, sans-serif" }}>
            Login Admin
          </h2>
          <p className="text-sm text-gray-600 mb-6">Masuk untuk mengelola data UMKM Desa Bejiarum</p>

          {/* FORM */}
          <form onSubmit={handleLogin} className="space-y-5 text-left">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username {/* ✨ UBAH LABEL INI ✨ */}
              </label>
              <input
                id="username" // ✨ UBAH ID INI ✨
                type="text" // ✨ UBAH TYPE INI ✨
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm transition"
                placeholder="bejiarumbersatu" // ✨ UBAH PLACEHOLDER INI ✨
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm transition"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {/* ✨ CHECKBOX REMEMBER ME ✨ */}
              <div className="text-left mt-1">
                <input id="rememberMe" type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="mt-3 h-4 w-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500" />
                <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-900">
                  Remember me
                </label>
              </div>
            </div>

            <button type="submit" className="w-full py-2 rounded-lg bg-yellow-500 text-white font-semibold hover:bg-yellow-600 transition-all duration-200 cursor-pointer">
              Get Started
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
