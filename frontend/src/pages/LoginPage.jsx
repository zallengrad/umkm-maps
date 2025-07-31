// frontend/src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { supabase } from "../utils/supabaseClient";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorLogin, setErrorLogin] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorLogin("");

    try {
      // Login dengan Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        console.error("Login Supabase Gagal:", error);
        let errorMessage = "Login gagal. Silakan coba lagi.";
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Email atau password salah.";
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Email belum dikonfirmasi. Mohon cek email Anda.";
        }
        throw new Error(errorMessage);
      }

      console.log("Login Supabase Berhasil:", data);

      // ✨ LOGIKA REMEMBER ME (disesuaikan dengan Supabase dan memastikan sinkronisasi) ✨
      // Pastikan Supabase tahu mode persistensi sesi kita
      if (rememberMe) {
        // Supabase akan otomatis menyimpan sesi di localStorage jika tidak ada konfigurasi storage.
        // Kita pastikan flag kita juga di localStorage.
        localStorage.setItem("isLoggedIn", "true");
        sessionStorage.removeItem("isLoggedIn");
      } else {
        // Untuk sesi saja, kita harus memastikan Supabase menyimpan di sessionStorage.
        // Ini diatur di supabaseClient.js dengan storage: getAuthStorage().
        // Kita pastikan flag kita juga di sessionStorage.
        sessionStorage.setItem("isLoggedIn", "true");
        localStorage.removeItem("isLoggedIn");
      }

      // ✨ Opsional: Tambahkan sedikit penundaan kecil ✨
      // Ini kadang membantu browser untuk menyelesaikan operasi DOM/Storage.
      await new Promise((resolve) => setTimeout(resolve, 50)); // Penundaan 50ms

      navigate("/admin"); // Navigasi setelah memastikan storage set
    } catch (error) {
      console.error("Kesalahan saat login:", error.message);
      setErrorLogin(error.message);
    } finally {
      setIsLoading(false);
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
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm transition"
                placeholder="admin@bejiarum.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            </div>

            {/* CHECKBOX REMEMBER ME */}
            <div className="flex items-center">
              <input id="rememberMe" type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="h-4 w-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500" />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            {/* PESAN ERROR LOGIN */}
            {errorLogin && <p className="text-red-600 text-sm text-center mt-3">{errorLogin}</p>}

            <button type="submit" disabled={isLoading} className="w-full py-2 rounded-lg bg-yellow-500 text-white font-semibold hover:bg-yellow-600 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? "Logging in..." : "Get Started"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
