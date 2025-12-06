// frontend/src/components/Navbar.jsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = ({ onLogoutClick }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isLoginPage = location.pathname === "/login";
  const isAdminPage = location.pathname === "/admin" || location.pathname.startsWith("/admin/");
  const isHomePage = location.pathname === "/";
  const isDetailPage = location.pathname.startsWith("/umkm/");

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true" || sessionStorage.getItem("isLoggedIn") === "true";

  const defaultLogoutHandler = () => {
    localStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  const finalLogoutHandler = onLogoutClick || defaultLogoutHandler;

  const logoTarget = isAdminPage ? "/admin" : "/";

  let rightButton = null;

  if (isLoginPage) {
    // Tombol di halaman login tetap Home
    rightButton = (
      <Link to="/" className="text-sm font-medium text-white bg-[#F59E0B] px-4 py-2 rounded-lg hover:bg-yellow-600 transition" style={{ fontFamily: "Inter, sans-serif" }}>
        Home
      </Link>
    );
  } else if (isAdminPage) {
    // Tombol di halaman admin adalah Logout
    rightButton = (
      <button onClick={finalLogoutHandler} className="text-sm font-medium text-white bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition cursor-pointer" style={{ fontFamily: "Inter, sans-serif" }}>
        Logout
      </button>
    );
  }
  // Tombol login dihilangkan untuk halaman utama dan detail

  return (
    <header className="fixed top-0 w-full z-50">
      {/* ✨ PERUBAHAN DI SINI: Ganti style Navbar ✨ */}
      {/* Warna background solid, bukan lagi glassmorphism */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          {/* Judul / Logo */}
          <Link to={logoTarget} className="text-xl md:text-2xl font-bold text-gray-800" style={{ fontFamily: "Poppins, sans-serif" }}>
            UMKM Bejiarum
          </Link>

          {/* Tombol kanan */}
          {rightButton}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
