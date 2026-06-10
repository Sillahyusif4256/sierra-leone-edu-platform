// MIT License
// Copyright (c) 2026 Sierra Leone Education Platform

import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../store/authStore';
import { FiHome, FiSearch, FiUpload, FiBell, FiUser } from 'react-icons/fi';
import { useEffect, useState } from 'react';

const MobileNav = () => {
  const { user } = useAuthStore();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Slide up animation when page loads
    setIsVisible(true);

    // Hide bottom nav when keyboard is open
    const handleViewportResize = () => {
      if (window.visualViewport) {
        const keyboardOpen = window.visualViewport.height < window.innerHeight * 0.8;
        setIsVisible(!keyboardOpen);
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportResize);
      return () => {
        window.visualViewport.removeEventListener('resize', handleViewportResize);
      };
    }
  }, []);

  const navItems = [
    { path: '/', icon: FiHome, label: 'Home' },
    { path: '/browse', icon: FiSearch, label: 'Browse' },
    { path: '/upload', icon: FiUpload, label: 'Upload', requiresAuth: true },
    { path: '/notifications', icon: FiBell, label: 'Alerts', requiresAuth: true },
    { path: '/dashboard', icon: FiUser, label: 'Profile', requiresAuth: true },
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-50"
          style={{ height: '60px' }}
        >
          <div className="flex justify-around items-center h-full">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              const showItem = !item.requiresAuth || (item.requiresAuth && user);

              if (!showItem) return null;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center justify-center w-full h-full transition relative ${
                    isActive ? 'text-sl-green' : 'text-gray-500 dark:text-gray-400'
                  }`}
                  aria-label={item.label}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="text-xl" />
                  <span className="text-xs mt-1">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -top-1 w-1 h-1 bg-sl-green rounded-full"
                      initial={false}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileNav;
