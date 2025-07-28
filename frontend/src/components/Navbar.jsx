// frontend/src/components/Navbar.jsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = ({ onLogoutClick }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isLoginPage = location.pathname === "/login";
  // ✨ PERBAIKAN DI SINI: Tangani trailing slash untuk isAdminPage ✨
  const isAdminPage = location.pathname === "/admin" || location.pathname === "/admin/";
  // Alternatif yang lebih kuat: location.pathname.startsWith("/admin") && (location.pathname.length === 6 || location.pathname.length === 7)

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
    rightButton = (
      <Link to="/" className="text-sm font-medium text-white bg-[#F59E0B] px-4 py-2 rounded-lg hover:bg-yellow-600 transition" style={{ fontFamily: "Inter, sans-serif" }}>
        Home
      </Link>
    );
  } else if (isDetailPage) {
    rightButton = null;
  } else if (isAdminPage) {
    // Blok ini sekarang akan terpanggil untuk /admin dan /admin/
    rightButton = (
      <button onClick={finalLogoutHandler} className="text-sm font-medium text-white bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition cursor-pointer" style={{ fontFamily: "Inter, sans-serif" }}>
        Logout
      </button>
    );
  } else if (isHomePage) {
    rightButton = (
      <Link to="/login" className="text-sm font-medium text-white bg-[#F59E0B] px-4 py-2 rounded-lg hover:bg-yellow-600 transition" style={{ fontFamily: "Inter, sans-serif" }}>
        Login
      </Link>
    );
  }

  return (
    <header className="fixed top-0 w-full z-50">
      <div className="backdrop-blur-md bg-white/30 border-b border-white/20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          {/* Judul / Logo */}
          <Link to={logoTarget} className="text-xl md:text-2xl font-bold text-[#F59E0B]" style={{ fontFamily: "Poppins, sans-serif" }}>
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
