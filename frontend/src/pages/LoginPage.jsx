import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === "admin@desa.com" && password === "admin123") {
      localStorage.setItem("isLoggedIn", "true");
      navigate("/admin");
    } else {
      alert("Email atau password salah.");
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
                placeholder="admin@desa.com"
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
              <div className="text-right mt-1">
                <a href="#" className="text-sm text-yellow-600 hover:underline">
                  Forgot password?
                </a>
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
