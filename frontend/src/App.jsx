// frontend/src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import DetailPage from "./pages/DetailPage"; // ✨ IMPORT DETAILPAGE ✨
import ProtectedRoute from "./components/ProtectedRoute"; // Jika menggunakan ini

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* ✨ TAMBAHKAN RUTE UNTUK DETAIL PAGE ✨ */}
        <Route path="/umkm/:id" element={<DetailPage />} />

        {/* Rute yang dilindungi untuk AdminPage */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        {/* Tambahkan rute lain jika ada */}
      </Routes>
    </Router>
  );
}

export default App;
