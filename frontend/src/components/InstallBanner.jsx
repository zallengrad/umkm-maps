import React, { useState, useEffect } from 'react';
import { FiDownload, FiX, FiSmartphone, FiCheck } from 'react-icons/fi';

const InstallBanner = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if PWA is already installed
    const checkInstalled = () => {
      // Check for standalone mode (Android/Desktop)
      if (window.matchMedia('(display-mode: standalone)').matches) {
        return true;
      }
      // Check for iOS standalone
      if (window.navigator.standalone === true) {
        return true;
      }
      return false;
    };

    if (checkInstalled()) {
      setIsInstalled(true);
      return;
    }

    // Check if banner was dismissed recently
    const dismissed = localStorage.getItem('installBannerDismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      if (Date.now() - dismissedTime < sevenDays) {
        return;
      }
    }

    // Listen for beforeinstallprompt event
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true); // Show immediately for testing
    };

    window.addEventListener('beforeinstallprompt', handler);

    // For testing: show banner even without beforeinstallprompt event
    // This helps see the banner in development
    setTimeout(() => {
      if (!deferredPrompt) {
        setShowBanner(true); // Show banner anyway for testing
      }
    }, 1000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, [deferredPrompt]);

  const handleInstallClick = () => {
    setShowModal(true);
  };

  const handleConfirmInstall = async () => {
    if (!deferredPrompt) {
      // Fallback for browsers that don't support install prompt
      alert('Untuk install aplikasi:\n\nAndroid/Chrome: Tap menu (⋮) → "Install app" atau "Add to Home screen"\n\niOS/Safari: Tap Share (⎙) → "Add to Home Screen"');
      setShowModal(false);
      return;
    }

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setShowBanner(false);
        setShowModal(false);
      }
      
      setDeferredPrompt(null);
    } catch (error) {
      console.error('Install error:', error);
    }
  };

  const handleDismissBanner = () => {
    setShowBanner(false);
    localStorage.setItem('installBannerDismissed', Date.now().toString());
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Don't show if already installed or banner is hidden
  if (isInstalled || !showBanner) {
    return null;
  }

  return (
    <>
      {/* Install Banner */}
      <section className="bg-gray-100 py-6 px-4 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Left Content */}
            <div className="flex items-center gap-4 text-gray-900">
              <div className="bg-gray-900 p-3 rounded-xl">
                <FiSmartphone className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1" style={{ fontFamily: "Poppins, sans-serif" }}>
                  Install Aplikasi UMKM Bejiarum
                </h3>
                <p className="text-gray-700 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                  Akses lebih cepat, bisa offline, dan pengalaman seperti aplikasi native!
                </p>
              </div>
            </div>

            {/* Right Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleInstallClick}
                className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                <FiDownload className="w-5 h-5" />
                Install Sekarang
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Install Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl animate-scale-in">
            {/* Modal Header */}
            <div className="bg-gray-900 p-6 rounded-t-2xl text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/10 p-2 rounded-lg">
                    <FiDownload className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold" style={{ fontFamily: "Poppins, sans-serif" }}>
                    Install Aplikasi
                  </h3>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="text-white/80 hover:text-white transition"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>
                  Keuntungan Install Aplikasi:
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <FiCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                      <strong>Akses Lebih Cepat</strong> - Buka langsung dari homescreen
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FiCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                      <strong>Bisa Offline</strong> - Tetap bisa browsing UMKM tanpa internet
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FiCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                      <strong>Hemat Data</strong> - Konten di-cache, kurangi penggunaan data
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FiCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                      <strong>Seperti App Native</strong> - Full screen, tanpa browser bar
                    </span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleConfirmInstall}
                  className="flex-1 bg-gray-900 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 shadow-md hover:shadow-lg"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Ya, Install Sekarang
                </button>
                <button
                  onClick={handleCloseModal}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Nanti
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InstallBanner;
