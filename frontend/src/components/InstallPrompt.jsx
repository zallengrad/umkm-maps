// src/components/InstallPrompt.jsx
import React, { useState, useEffect, useRef } from 'react';
import { FiX, FiDownload } from 'react-icons/fi';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const timeoutRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return; // Already installed, don't show prompt
    }

    // Check if dismissed recently
    const dismissed = localStorage.getItem('installPromptDismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      if (Date.now() - dismissedTime < sevenDays) {
        return;
      }
    }

    const handler = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      if (isMountedRef.current) {
        setDeferredPrompt(e);
        // Show the install prompt after a delay
        timeoutRef.current = setTimeout(() => {
          if (isMountedRef.current) {
            setShowPrompt(true);
          }
        }, 3000); // Show after 3 seconds
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      isMountedRef.current = false;
      window.removeEventListener('beforeinstallprompt', handler);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt || !isMountedRef.current) return;

    try {
      // Show the install prompt
      await deferredPrompt.prompt();

      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;

      // Clear the deferredPrompt
      if (isMountedRef.current) {
        setDeferredPrompt(null);
        setShowPrompt(false);
      }
    } catch (error) {
      console.error('Install prompt error:', error);
    }
  };

  const handleDismiss = () => {
    if (isMountedRef.current) {
      setShowPrompt(false);
      // Store dismissal in localStorage to not show again for a while
      localStorage.setItem('installPromptDismissed', Date.now().toString());
    }
  };

  if (!showPrompt || !deferredPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-slide-up">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <FiDownload className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Install Aplikasi</h3>
                <p className="text-sm text-blue-100">UMKM Desa Bejiarum</p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-white/80 hover:text-white transition"
              aria-label="Dismiss"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="p-4">
          <p className="text-gray-600 text-sm mb-4">
            Install aplikasi ini ke homescreen untuk akses lebih cepat dan pengalaman seperti aplikasi native.
          </p>
          
          <div className="flex gap-2">
            <button
              onClick={handleInstallClick}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Install Sekarang
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 py-2.5 text-gray-600 hover:text-gray-800 font-medium transition"
            >
              Nanti
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;
