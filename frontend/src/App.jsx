// frontend/src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import DetailPage from "./pages/DetailPage";
import ProtectedRoute from "./components/ProtectedRoute";
// import InstallPrompt from "./components/InstallPrompt";
// import UpdateNotification from "./components/UpdateNotification";

function App() {
  return (
    <Router>
      {/* PWA Components - Disabled in development, will work in production build */}
      {/* <InstallPrompt /> */}
      {/* <UpdateNotification /> */}
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/umkm/:id" element={<DetailPage />} />

        {/* Protected route for AdminPage */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
