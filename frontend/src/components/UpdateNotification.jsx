// src/components/UpdateNotification.jsx
import React, { useState, useEffect, useRef } from 'react';
import { FiRefreshCw, FiX } from 'react-icons/fi';
import { useRegisterSW } from 'virtual:pwa-register/react';

const UpdateNotification = () => {
  const [showNotification, setShowNotification] = useState(false);
  const isMountedRef = useRef(true);

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ' + r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  useEffect(() => {
    isMountedRef.current = true;

    if (needRefresh && isMountedRef.current) {
      setShowNotification(true);
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [needRefresh]);

  const handleUpdate = () => {
    if (isMountedRef.current) {
      updateServiceWorker(true);
    }
  };

  const handleDismiss = () => {
    if (isMountedRef.current) {
      setShowNotification(false);
      setNeedRefresh(false);
    }
  };

  if (!showNotification) return null;

  return (
    <div className="fixed top-20 right-4 z-50 animate-slide-down">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden max-w-sm">
        <div className="bg-gradient-to-r from-green-600 to-green-700 p-3 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiRefreshCw className="w-5 h-5" />
              <h3 className="font-bold">Update Tersedia</h3>
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
          <p className="text-gray-600 text-sm mb-3">
            Versi baru aplikasi tersedia. Reload untuk mendapatkan fitur terbaru.
          </p>
          
          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <FiRefreshCw className="w-4 h-4" />
              Reload Sekarang
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition"
            >
              Nanti
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateNotification;
