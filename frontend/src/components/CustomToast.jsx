// MIT License
// Copyright (c) 2026 Sierra Leone Education Platform

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiX, FiAlertTriangle, FiInfo } from 'react-icons/fi';

const toastVariants = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 100 }
};

const CustomToast = ({ type = 'success', message, onClose, duration = 4000 }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - (100 / (duration / 100));
      });
    }, 100);

    const timeout = setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      clearInterval(timer);
      clearTimeout(timeout);
    };
  }, [duration, onClose]);

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return {
          borderLeftColor: '#1EB53A',
          icon: <FiCheck className="w-5 h-5 text-green-500" />,
          bgColor: 'bg-white dark:bg-gray-800'
        };
      case 'error':
        return {
          borderLeftColor: '#EF4444',
          icon: <FiX className="w-5 h-5 text-red-500" />,
          bgColor: 'bg-white dark:bg-gray-800'
        };
      case 'warning':
        return {
          borderLeftColor: '#F59E0B',
          icon: <FiAlertTriangle className="w-5 h-5 text-yellow-500" />,
          bgColor: 'bg-white dark:bg-gray-800'
        };
      case 'info':
        return {
          borderLeftColor: '#3B82F6',
          icon: <FiInfo className="w-5 h-5 text-blue-500" />,
          bgColor: 'bg-white dark:bg-gray-800'
        };
      default:
        return {
          borderLeftColor: '#1EB53A',
          icon: <FiCheck className="w-5 h-5 text-green-500" />,
          bgColor: 'bg-white dark:bg-gray-800'
        };
    }
  };

  const styles = getToastStyles();

  return (
    <motion.div
      variants={toastVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`${styles.bgColor} rounded-lg shadow-lg border-l-4 mb-3 overflow-hidden dark:border-gray-700`}
      style={{ borderLeftColor: styles.borderLeftColor }}
    >
      <div className="p-4 flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          {styles.icon}
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-800 dark:text-gray-200">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
        >
          <FiX className="w-4 h-4" />
        </button>
      </div>
      <div className="h-1 bg-gray-200 dark:bg-gray-700">
        <motion.div
          className="h-full"
          style={{ backgroundColor: styles.borderLeftColor }}
          initial={{ width: '100%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>
    </motion.div>
  );
};

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col space-y-3 max-w-sm w-full">
      <AnimatePresence>
        {toasts.map((toast) => (
          <CustomToast
            key={toast.id}
            type={toast.type}
            message={toast.message}
            onClose={() => removeToast(toast.id)}
            duration={toast.duration}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export { CustomToast, ToastContainer };
