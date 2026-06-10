// MIT License
// Copyright (c) 2026 Sierra Leone Education Platform

import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle, FiLogOut, FiTrash2, FiX } from 'react-icons/fi';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, type = 'danger', extraInfo }) => {
  const icons = {
    danger: <FiAlertTriangle className="w-12 h-12 text-red-500" />,
    warning: <FiAlertTriangle className="w-12 h-12 text-yellow-500" />,
    logout: <FiLogOut className="w-12 h-12 text-blue-500" />,
  };

  const colors = {
    danger: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    logout: 'bg-blue-50 border-blue-200',
  };

  const buttonColors = {
    danger: 'bg-red-500 hover:bg-red-600',
    warning: 'bg-yellow-500 hover:bg-yellow-600',
    logout: 'bg-blue-500 hover:bg-blue-600',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            {/* Dialog */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border-2 ${colors[type]}`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                aria-label="Close"
              >
                <FiX className="w-5 h-5" />
              </button>

              {/* Icon */}
              <div className="flex justify-center mb-4">
                {icons[type]}
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold text-gray-800 text-center mb-2">
                {title}
              </h2>

              {/* Message */}
              <p className="text-gray-600 text-center mb-4">
                {message}
              </p>

              {/* Extra Info */}
              {extraInfo && (
                <div className="bg-gray-50 rounded-lg p-3 mb-6">
                  <p className="text-sm text-gray-500 text-center">{extraInfo}</p>
                </div>
              )}

              {/* Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={`flex-1 px-4 py-3 text-white rounded-lg font-semibold transition ${buttonColors[type]} flex items-center justify-center space-x-2`}
                >
                  {type === 'danger' && <FiTrash2 />}
                  {type === 'logout' && <FiLogOut />}
                  <span>Confirm</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;
