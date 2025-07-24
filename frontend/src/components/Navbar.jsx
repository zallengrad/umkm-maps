import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isLoginPage = location.pathname === "/login";
  const isAdminPage = location.pathname === "/admin";

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  // Logo arah ke /admin jika sedang di halaman admin, sisanya ke /
  const logoTarget = isAdminPage ? "/admin" : "/";

  return (
    <header className="fixed top-0 w-full z-50">
      <div className="backdrop-blur-md bg-white/30 border-b border-white/20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          {/* Judul / Logo */}
          <Link to={logoTarget} className="text-xl md:text-2xl font-bold text-[#F59E0B]" style={{ fontFamily: "Poppins, sans-serif" }}>
            UMKM Bejiarum
          </Link>

          {/* Tombol kanan */}
          {isLoginPage ? (
            <Link to="/" className="text-sm font-medium text-white bg-[#F59E0B] px-4 py-2 rounded-lg hover:bg-yellow-600 transition" style={{ fontFamily: "Inter, sans-serif" }}>
              Home
            </Link>
          ) : isAdminPage ? (
            <button onClick={handleLogout} className="text-sm font-medium text-white bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition cursor-pointer" style={{ fontFamily: "Inter, sans-serif" }}>
              Logout
            </button>
          ) : (
            <Link to="/login" className="text-sm font-medium text-white bg-[#F59E0B] px-4 py-2 rounded-lg hover:bg-yellow-600 transition" style={{ fontFamily: "Inter, sans-serif" }}>
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
