// MIT License
// Copyright (c) 2026 Sierra Leone Education Platform

import { useState, useEffect } from 'react';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if user has dismissed the prompt
    const dismissed = localStorage.getItem('edushare_install_dismissed');
    if (dismissed) {
      const dismissedDate = new Date(dismissed);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      if (dismissedDate > sevenDaysAgo) {
        return; // Don't show if dismissed within last 7 days
      }
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show prompt after 30 seconds
      setTimeout(() => {
        setShowPrompt(true);
      }, 30000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('PWA installed');
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('edushare_install_dismissed', new Date().toISOString());
    setDeferredPrompt(null);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-4 z-50 border border-gray-200 dark:border-gray-700">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-sl-green rounded-lg flex items-center justify-center">
            <span className="text-2xl">📱</span>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-1">
            Install EduShare SL
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            Install EduShare SL for offline access and a better experience!
          </p>
          <div className="flex space-x-2">
            <button
              onClick={handleInstall}
              className="flex-1 bg-sl-green text-white px-4 py-2 rounded-lg hover:bg-green-600 transition text-sm font-medium"
            >
              Install
            </button>
            <button
              onClick={handleDismiss}
              className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-sm"
            >
              Maybe Later
            </button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default InstallPrompt;
