// MIT License
// Copyright (c) 2026 Sierra Leone Education Platform

import { useState, useEffect } from 'react';
import { FiWifi, FiWifiOff } from 'react-icons/fi';

const OfflineBanner = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOnlineBanner, setShowOnlineBanner] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOnlineBanner(true);
      setTimeout(() => setShowOnlineBanner(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showOnlineBanner) return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 px-4 py-3 text-center text-sm font-medium ${
        isOnline
          ? 'bg-green-500 text-white'
          : 'bg-yellow-500 text-white'
      }`}
    >
      <div className="flex items-center justify-center space-x-2">
        {isOnline ? (
          <>
            <FiWifi />
            <span>Back online!</span>
          </>
        ) : (
          <>
            <FiWifiOff />
            <span>You are offline — showing cached content</span>
          </>
        )}
      </div>
    </div>
  );
};

export default OfflineBanner;
