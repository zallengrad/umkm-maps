// frontend/src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from "react"; // Import useEffect dan useState
import { Navigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient"; // ✨ IMPORT SUPABASE CLIENT ✨

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // ✨ LOGIKA OTENTIKASI SUPABASE UNTUK PROTECTED ROUTE ✨
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user); // Set user jika ada
      setLoading(false); // Selesai loading

      // Sinkronkan custom flag isLoggedIn dengan status sesi Supabase
      if (user) {
        // Asumsi jika user ada dari Supabase, berarti logged in
        localStorage.setItem("isLoggedIn", "true");
      } else {
        // Jika tidak ada user dari Supabase, pastikan flag kita juga dihapus
        localStorage.removeItem("isLoggedIn");
        sessionStorage.removeItem("isLoggedIn");
      }
    };

    checkUser();

    // Opsional: Langganan perubahan status otentikasi Supabase
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        setUser(session?.user || null);
        localStorage.setItem("isLoggedIn", "true");
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        localStorage.removeItem("isLoggedIn");
        sessionStorage.removeItem("isLoggedIn");
      }
    });

    // Cleanup listener
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []); // Dependensi kosong agar hanya berjalan sekali saat mount

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>Memverifikasi sesi...</p>
      </div>
    );
  }

  // Jika user ada (dari Supabase), render children (AdminPage)
  // Jika tidak ada user (dan loading sudah selesai), alihkan ke halaman login
  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
