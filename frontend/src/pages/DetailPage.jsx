// frontend/src/pages/DetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FiChevronLeft, FiChevronRight, FiMapPin, FiPhone, FiClock, FiInfo } from "react-icons/fi";
import { API_BASE_URL } from "../utils/apiConfig";
import { getGalleryImage } from "../utils/imageOptimizer";
import { DetailSkeleton } from "../components/LoadingSkeleton";
import InstallBanner from "../components/InstallBanner";

const DetailPage = () => {
  const { id } = useParams();
  const [umkm, setUmkm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const isAdminLoggedIn = localStorage.getItem("isLoggedIn") === "true" || sessionStorage.getItem("isLoggedIn") === "true";
  const backLinkTarget = isAdminLoggedIn ? "/admin" : "/";

  useEffect(() => {
    const fetchUMKMDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/umkm/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUmkm(data);
      } catch (err) {
        console.error("❌ Gagal mengambil detail UMKM:", err);
        setError("Gagal memuat detail UMKM. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUMKMDetail();
    }
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <section className="pt-24 px-4 py-10 min-h-screen bg-gray-50">
          <DetailSkeleton />
        </section>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <section className="pt-24 px-4 py-10 min-h-screen flex flex-col items-center justify-center bg-gray-50">
          <p className="text-center text-red-600">{error}</p>
          <Link to={backLinkTarget} className="mt-4 text-blue-500 hover:underline">
            Kembali ke {isAdminLoggedIn ? "Dashboard Admin" : "Beranda"}
          </Link>
        </section>
        <Footer />
      </>
    );
  }

  if (!umkm) {
    return (
      <>
        <Navbar />
        <section className="pt-24 px-4 py-10 min-h-screen flex flex-col items-center justify-center bg-gray-50">
          <p className="text-center text-gray-500">UMKM tidak ditemukan.</p>
          <Link to={backLinkTarget} className="mt-4 text-blue-500 hover:underline">
            Kembali ke {isAdminLoggedIn ? "Dashboard Admin" : "Beranda"}
          </Link>
        </section>
        <Footer />
      </>
    );
  }

  const validPhotos = (umkm.photos || []).filter((url) => url);
  const displayedPhotos = validPhotos.length > 0 
    ? validPhotos.map(url => getGalleryImage(url))
    : ["/images/placeholder-umkm.jpg"];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % displayedPhotos.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + displayedPhotos.length) % displayedPhotos.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section with Carousel */}
      <div className="relative w-full h-screen">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src={displayedPhotos[currentSlide]}
            alt={`${umkm.name} - Slide ${currentSlide + 1}`}
            className="w-full h-full object-cover transition-opacity duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30"></div>
        </div>

        {/* Navigation Buttons - Only show if more than 1 photo */}
        {displayedPhotos.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300"
              aria-label="Previous slide"
            >
              <FiChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300"
              aria-label="Next slide"
            >
              <FiChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Content */}
        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="max-w-3xl pt-20">
            {/* Category Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-white text-sm font-medium">{umkm.category || "UMKM"}</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              {umkm.name}
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-gray-200 mb-8 leading-relaxed line-clamp-4">
              {umkm.description || "Deskripsi belum tersedia."}
            </p>

            {/* Details Grid */}
            <div className="grid gap-4 mb-8 text-gray-300">
              {umkm.address && (
                <div className="flex items-start gap-3">
                  <FiMapPin className="w-5 h-5 mt-1 flex-shrink-0 text-blue-400" />
                  <p className="text-base leading-relaxed">{umkm.address}</p>
                </div>
              )}
              
              {umkm.kontak && (
                <div className="flex items-center gap-3">
                  <FiPhone className="w-5 h-5 flex-shrink-0 text-green-400" />
                  <p className="text-base">{umkm.kontak}</p>
                </div>
              )}

              {umkm.jam_buka && umkm.jam_tutup && (
                <div className="flex items-center gap-3">
                  <FiClock className="w-5 h-5 flex-shrink-0 text-purple-400" />
                  <p className="text-base">Jam Buka: {umkm.jam_buka} - {umkm.jam_tutup}</p>
                </div>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              {umkm.Maps_url && (
                <a 
                  href={umkm.Maps_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <FiMapPin className="w-5 h-5" />
                  Lihat di Google Maps
                </a>
              )}
              
              {/* Optional: Add Contact Button if needed */}
              {/* <button className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/30">
                <FiPhone className="w-5 h-5" />
                Hubungi Penjual
              </button> */}
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        {displayedPhotos.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {displayedPhotos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/40'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>


      {/* Google Maps Preview Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Lokasi Kami</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Kunjungi kami langsung di lokasi. Klik peta untuk navigasi lebih detail.
            </p>
          </div>
          
          <div className="bg-gray-100 rounded-2xl overflow-hidden shadow-lg h-96 w-full relative">
            <iframe
              title="Google Maps Preview"
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              marginHeight="0"
              marginWidth="0"
              src={`https://maps.google.com/maps?q=${encodeURIComponent((umkm.name || "") + " " + (umkm.address || ""))}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              className="w-full h-full"
            ></iframe>
            
            {/* Overlay for interaction hint if needed, or just keep it simple */}
            {umkm.Maps_url && (
              <a 
                href={umkm.Maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 right-4 bg-white text-blue-600 px-4 py-2 rounded-lg shadow-md font-medium hover:bg-gray-50 transition text-sm flex items-center gap-2"
              >
                <FiMapPin /> Buka di Google Maps
              </a>
            )}
          </div>
        </div>
      </section>
      
      
      {/* Install Banner - Above Footer */}
      <InstallBanner />
      
      <Footer />
    </div>
  );
};

export default DetailPage;
